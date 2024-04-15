import slugify from 'slugify'
import { BrandModel } from '../../../DB/models/Brand.model.js'
import { categoryModel } from '../../../DB/models/category.model.js'
import { SubCategoryModel } from '../../../DB/models/subCategory.model.js'
import { customAlphabet } from 'nanoid'
import cloudinary from '../../utils/cloudinaryCofigration.js'
import { productModel } from '../../../DB/models/product.model.js'
import { paginationFunc } from '../../utils/pagination.js'
const nanoid = customAlphabet('123456_=!ascbhdtel', 5)

/*add product*/
export const addproduct = async (req, res, next) => {
  const { _id } = req.authUser
  const { title, desc, price, appliedDiscount, colors, sizes, stock, categoryId, SubCategoryId, brandId } = req.query
  const category = await categoryModel.findOne({ _id: categoryId })
  if (!category) { return next(new Error('inavalid Category id', { cause: 400 })) }
  const subCategory = await SubCategoryModel.findOne({ _id: SubCategoryId })
  if (!subCategory) { return next(new Error('inavalid Subcategory id', { cause: 400 })) }

  const BrandExist = await BrandModel.findOne({ _id: brandId, categoryId, SubCategoryId })
  if (!BrandExist) {
    console.log({ categoryId, brandId, SubCategoryId });
    return next(new Error('invalid Id'))
  }
  const slug = slugify(title, '-')
  var priceAfter = price;
  appliedDiscount ? priceAfter = price * (1 - (appliedDiscount || 0) / 100): priceAfter = price
  if (!req.files) {
    return next(new Error('please upload some pictures of the the product', { cause: 400 }))
  }
  const Images = []
  const CustomId = nanoid()
  const publicIds = []
  for (const file of req.files) {
    try {
      var { secure_url, public_id } = await cloudinary.uploader.upload(file.path, { folder: `${process.env.PROJECT_FOLDER}/Categories/${category.CustomId}/SubCategories/${subCategory.CustomId}/Brands/${BrandExist.CustomId}/products/${CustomId}` })
    } catch (error) {
      console.log(error);
    }
    Images.push({ secure_url, public_id })
    publicIds.push(public_id)
  }
  const productObject = {
    title,
    slug,
    desc,
    price,
    appliedDiscount,
    priceAfter,
    colors,
    sizes,
    stock,
    categoryId,
    SubCategoryId,
    brandId,
    Images,
    CustomId,
    createdBy: _id
  }
  const product = await productModel.create(productObject)
  if (!product) {
    try {
      await cloudinary.api.delete_resources(publicIds)
    } catch (error) {
      console.log(error);
    }
    return next(new Error('try again later', { cause: 400 }))
  }
  res.status(200).json({ messag: 'product added', product })
}

/*update product */
export const updateProduct = async (req, res, next) => {
  var { title, desc, price, appliedDiscount, colors, sizes, stock, productId, categoryId, subCategoryId, brandId } = req.query
  const ProductExist = await productModel.findById(productId)
  if (!ProductExist) {
    return next(new Error('invalid product id', { cause: 400 }))
  }
  const subCategoryExists = await SubCategoryModel.findById(
    subCategoryId || ProductExist.SubCategoryId,
  )
  if (subCategoryId) {
    if (!subCategoryExists) {
      return next(new Error('invalid subcategories', { cause: 400 }))
    }
    ProductExist.SubCategoryId = subCategoryId
  }
  const categoryExists = await categoryModel.findById(
    categoryId || ProductExist.categoryId,
  )
  if (categoryId) {
    if (!categoryExists) {
      return next(new Error('invalid categories', { cause: 400 }))
    }
    ProductExist.categoryId = categoryId
  }
  const brandExists = await BrandModel.findById(brandId || product.brandId)
  if (brandId) {
    if (!brandExists) {
      return next(new Error('invalid brand', { cause: 400 }))
    }
    ProductExist.brandId = brandId
  }
  if (appliedDiscount && price) {
    var priceAfter = price * (1 - (appliedDiscount || 0) / 100)
    ProductExist.priceAfter = priceAfter
    ProductExist.price = price
    ProductExist.appliedDiscount = appliedDiscount
  } else if (price) {
    var priceAfter = price * (1 - (ProductExist.appliedDiscount || 0) / 100)
    ProductExist.priceAfter = priceAfter
    ProductExist.price = price
  } else if (appliedDiscount) {
    var priceAfter = ProductExist.price * (1 - (appliedDiscount || 0) / 100)
    ProductExist.priceAfter = priceAfter
    ProductExist.appliedDiscount = appliedDiscount
  }
  if (req.files?.length) {
    let ImageArr = []
    for (const file of req.files) {
      try {
        var { secure_url, public_id } = await cloudinary.uploader.upload(file.path, { folder: `${process.env.PROJECT_FOLDER}/Categories/${categoryExists.CustomId}/subCategories/${subCategoryExists.CustomId}/Brands/${brandExists.CustomId}/products/${ProductExist.CustomId}` })
      } catch (error) {
        console.log(error);
      }
      ImageArr.push({ secure_url, public_id })
    }
    let public_ids = []
    for (const image of ProductExist.Images) {
      public_ids.push(image.public_id)
    }
    ProductExist.Images = ImageArr
  }
  if (title) {
    ProductExist.title = title
    ProductExist.slug = slugify(title, '-')
  }
  desc ? ProductExist.desc = desc : desc = desc
  colors ? ProductExist.colors = colors : colors = colors
  sizes ? ProductExist.sizes = sizes : sizes = sizes
  stock ? ProductExist.stock = stock : stock = stock

  await ProductExist.save()
  res.status(200).json({
    message: "product updated",
    ProductExist
  })
}

/*delete product*/
export const deleteproduct = async (req, res, next) => {
  const { productId } = req.query
  const product = await productModel.findOneAndDelete(productId)
  if (!product) {
    return next(new Error('invalid product id', { cause: 400 }))
  }
  const category=await categoryModel.findOne({_id:product.categoryId})
  const subCategory=await SubCategoryModel.findOne({_id:product.SubCategoryId})
  const Brand=await BrandModel.findOne({_id:product.brandId})

  const Arr = product.Images
  for (const image of Arr) {
    try {
      await cloudinary.api.delete_resources(image.public_id)
    } catch (error) {
      console.log(error);
    }
  }
  try {
    await cloudinary.api.delete_folder(`${process.env.PROJECT_FOLDER}/Categories/${category.CustomId}/SubCategories/${subCategory.CustomId}/Brands/${Brand.CustomId}/products/${product.CustomId}`)
  } catch (error) {
    console.log(error);
  }
  res.status(200).json({ message: 'product was deleted' })
}

/*getAllproduct*/ //Paginated
export const getAllproduct = async (req, res, next) => {
  const { page, size } = req.query
  const { limit, skip } = paginationFunc({ page, size })
  const products = await productModel.find().select('title').select('price'). sort({price:1}).limit(limit).skip(skip)
  res.status(200).json({ message: 'done', products})
}

/*getproductswfilter*/
export const getproductswfilter = async (req, res, next) => {
  const products = await productModel.find().select(req.query.select.replaceAll(',', ' '))
  const PRODUCTS = await productModel.find({
    $or: [
      { title: { $regex: req.query.searchKey, $options: 'i' } },
      { desc: { $regex: req.query.searchKey, $options: 'i' } }
    ]
  })
  const queryInstance = { ...req.query }
  const execludedKeys = ['page', 'size', 'sort', 'select', 'search']
  execludedKeys.forEach((key) => delete queryInstance[key])
  const queryFilter = JSON.parse(
    JSON.stringify(queryInstance).replace(
      /gt|gte|lt|lte|in|nin|eq|neq|regex/g,

    )
  )
  const Products = productModel.find(queryFilter)
  const apiFeaturesInstance = new ApiFeatures(productModel.find(), req.query)
    .sort()
    .pagination()
    .filters()
  const data = await apiFeaturesInstance.mongooseQuery
  res.status(200).json({ message: 'done', Products,data })
}
