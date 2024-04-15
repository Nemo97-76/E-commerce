import slugify from 'slugify'
import cloudinary from '../../utils/cloudinaryCofigration.js'
import { categoryModel } from '../../../DB/models/category.model.js'
import { customAlphabet } from 'nanoid'
import { SubCategoryModel, SubCategorySchema } from '../../../DB/models/subCategory.model.js'
import { BrandModel } from '../../../DB/models/Brand.model.js'
import { productModel } from '../../../DB/models/product.model.js'
const nanoid = customAlphabet('123456_=!ascbhdtel', 5)

/*create Category*/
export const CreateCategory = async (req, res, next) => {
    const { _id } = req.authUser
    const { name } = req.query
    if (!name) {
        return next(new Error('please enter category name', { cause: 400 }))
    }
    if (!req.file) {
        return next(new Error('please upload image', { cause: 400 }))
    }
    const nameCheck = await categoryModel.findOne({ name })
    if (nameCheck) {
        return next(new Error('name already exist', { cause: 400 }))
    }
    const slug = slugify(name, '-')
    const CustomId = nanoid()
    try {
        const { secure_url, public_id } = await cloudinary.uploader.upload(
            req.file.path,
            { folder: `${process.env.PROJECT_FOLDER}/Categories/${CustomId}` }
        )
        const CategoryObject = {
            name,
            slug,
            Image: {
                secure_url,
                public_id
            },
            CustomId,
            AddedBy:_id
        }
        const catogry = await categoryModel.create(CategoryObject)
        if (!catogry) {
            await cloudinary.uploader.destroy(public_id)
            return next(new Error('fail to create your category ,please try again later', { cause: 400 }))
        }
    } catch (error) {
        console.log(error);
    }
    res.status(200).json({
        message: "done"
    })
}
/*update Category*/
export const UpdateCat = async (req, res, next) => {
    const { _id } = req.authUser
    const { name,categoryId } = req.query

    const category = await categoryModel.findById({
        _id: categoryId,
        AddedBy: _id
    })
    if (!category) {
        return next(new Error('invalid Category Id', { cause: 400 }))
    }
    if (name) {
        if (category.name == name) {

            return next(new Error('please enter different name from old category name', { cause: 400 }))
        }
        const catname = await categoryModel.findOne({ name })
        if (catname) {
            return next(new Error('please enter different category name , duplicate name', { cause: 400 }))
        }
        category.name = name
        category.slug = slugify(name, '-')
    }
    if (req.file) {
        await cloudinary.uploader.destroy(category.Image.public_id)
        const { secure_url, public_id } = await cloudinary.uploader.upload(
            req.file.path,
            {
                folder: `${process.env.PROJECT_FOLDER}/Categories/${category.customId}`
            }
        )
        category.Image = { secure_url, public_id }
    }
    category.updatedBy = _id
    await category.save()
    res.status(200).json({
        message: 'category was Updated successfully',
        category
    })
}
/*get all cat w sub*/
export const getAllcatwsub = async (req, res, next) => {
   
    const categories= await categoryModel.find().populate([
        {
            path:'SubCategory',
            select:'name',
            strictPopulate:false
        }
    ])
    if(!categories){
        return next(new Error('fail',{cause:400}))
    }    
    res.status(200).json({
        message:'done',
        AllCategories:categories
    })
}
/*delet cat*/
export const deleteCat = async (req, res, next) => {
    const { _id } = req.authUser
    const { categoryId } = req.query
    
    const categoryExists = await categoryModel.findByIdAndDelete({
        _id:categoryId,
        AddedBy:_id
    })
    if (!categoryExists) {
        console.log(categoryId);
        return next(new Error('invalid category Id', { cause: 400 }))
    }/* 
    const deleteRelatedSubCat = await SubCategoryModel.deleteMany({
        categoryId
    })
    if (!deleteRelatedSubCat.deletedCount) {
        return next(new Error('delete fail subCate', { cause: 400 }))
    }
    const deleteRelatedBranda = await BrandModel.deleteMany({
        categoryId
    })
    if (!deleteRelatedBranda.deletedCount) {
        return next(new Error('delete fail Brands', { cause: 400 }))
    }
    const deleteRelatedProducts = await productModel.deleteMany({
        categoryId
    })
    if (!deleteRelatedProducts.deletedCount) {
        return next(new Error('delete fail products', { cause: 400 }))
    }*/
try{
    await cloudinary.uploader.destroy(categoryExists.Image.public_id)
try{
    await cloudinary.api.delete_folder(`${process.env.PROJECT_FOLDER}/Categories/${categoryExists.CustomId}`) 

}catch(error1){
    console.log(error1);
}
}catch(error2){
console.log(error2);
}
    res.status(200).json({ message: 'Deleted' })
}

