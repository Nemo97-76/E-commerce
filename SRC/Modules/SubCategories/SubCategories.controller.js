import slugify from "slugify";
import { categoryModel } from "../../../DB/models/category.model.js";
import { SubCategoryModel } from "../../../DB/models/subCategory.model.js";
import { customAlphabet } from "nanoid";
import cloudinary from '../../utils/cloudinaryCofigration.js'
const nanoid = customAlphabet('123456_=!ascbhdtel', 5)

/*add subCat*/
export const addSubCat = async (req, res, next) => {
    const { _id } = req.authUser
    const { name, categoryId } = req.query
    const category = await categoryModel.findById(categoryId)
    if (!category) {
        return next(new Error('invalid category id', { cause: 400 }))
    }
    const ifunique = await SubCategoryModel.findOne({ name })
    if (ifunique) {
        return next(new Error('duplicated name ', { cause: 400 }))
    }
    const slug = slugify(name, '-')
    if (!req.file) {
        return next(new Error('please upload subcategory image', { cause: 400 }))
    }
    const CustomId = nanoid()
    try {
        const { secure_url, public_id } = await cloudinary.uploader.upload(
            req.file.path,
            {
                folder: `${process.env.PROJECT_FOLDER}/Categories/${category.CustomId}/SubCategories/${CustomId}`
            }
        )
        const subCatObject = {
            name,
            slug,
            CustomId,
            Image: { secure_url, public_id },
            categoryId,
            createdBy: _id
        }
        const subcategory = await SubCategoryModel.create(subCatObject)
        if (!subcategory) {
            await cloudinary.uploader.destroy(public_id)
            return next(new Error('try again later', { cause: 400 }))
        }
        res.status(200).json({
            message: 'subcategory added',
            subcategory
        })
    } catch (error) {
        console.log(error);
    }
}


/*delete subcat*/
export const deleteSubCat = async (req, res, next) => {
    const { subcategoryID, categoryId } = req.query
    const category = await categoryModel.findById({ _id: categoryId })
    const SubCatExist = await SubCategoryModel.findByIdAndDelete(subcategoryID)
    if (!SubCatExist) {
        return next(new Error('invalid id', { cause: 400 }))
    }

    /*const deleteRelatedBranda = await BrandModel.deleteMany({
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
    try {
        await cloudinary.uploader.destroy(SubCatExist.Image.public_id)
        try {
            await cloudinary.api.delete_folder(`${process.env.PROJECT_FOLDER}/Categories/${category.CustomId}/SubCategories/${CustomId}`)
        } catch (error) {
            console.log(error);
        }
    } catch (error) {
        console.log(error);
    }
    res.status(200).json({
        message: "deleted"
    })
}


/*update SubCate*/
export const updatesubCate = async (req, res, next) => {
    const { _id } = req.authUser
    const { name, subcategoryID } = req.query
    const Subcategory = await SubCategoryModel.findById({ _id: subcategoryID, createdBy: _id })
    if (!Subcategory) {
        return next(new Error('invalid Subcategory id', { cause: 400 }))

    }
    const subcatName = await SubCategoryModel.findOne({ name} )
    if (name) {
        if (subcatName) {
            console.log(Subcategory.name);
            return next(new Error('this name already exists', { cause: 400 }))
        }
        Subcategory.name = name
    }
    if (req.file) {
        try {
            await cloudinary.uploader.destroy(Subcategory.Image.public_id)
        try {
            const { secure_url, public_id } = await cloudinary.uploader.upload(
                req.file.path,
                {
                    folder: `${process.env.PROJECT_FOLDER}/Categories/${Subcategory.categoryId}/SubCategories/${CustomId}`
                }
            )
            Subcategory.Image = { secure_url, public_id }
            const newSubCate = await Subcategory.save()
            res.status(200).json({
                message: 'subcategory was updated successfully',
                newSubCate
            })
        } catch (error) {
            console.log(error);
        }

        } catch (error) {
            console.log(error);
        }
        
    }
}