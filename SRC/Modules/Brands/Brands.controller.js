import slugify from 'slugify'
import {categoryModel} from '../../../DB/models/category.model.js'
import {SubCategoryModel} from '../../../DB/models/subCategory.model.js'
import cloudinary from '../../utils/cloudinaryCofigration.js'
import { customAlphabet } from 'nanoid'
import {BrandModel} from '../../../DB/models/Brand.model.js'
const nanoid = customAlphabet('123456_=!ascbhdtel', 5)

/*Add Brand*/
export const addBrand=async(req,res,next)=>{
    const {_id}=req.authUser

    const {SubCategoryId,name,categoryId}=req.query
    const category=await categoryModel.findById({_id:categoryId})

    const IDS=await SubCategoryModel.findById({_id:SubCategoryId,categoryId})
const IsNameExist=await BrandModel.findOne({name})
if(IsNameExist){
    return next(new Error(" Brand name already exists",{cause:400}))
}
    if (!IDS){
        return next(new Error("invalid Ids",{cause:400}))
    }
    const slug=slugify(name,{
        replacement:'-',
        lower:true
    })
    if(!req.file){
        return next(new Error('please upload your logo picture first',{cause:400}))
    }
    const CustomId=nanoid()
try{
    const {secure_url,public_id}=await cloudinary.uploader.upload(req.file.path,{folder:`${process.env.PROJECT_FOLDER}/Categories/${category.CustomId}/subCategories/${IDS.CustomId}/Brands/${CustomId}`})
    const BrandObject={
        name,
    slug,
        logo:{secure_url,public_id},
        categoryId,
        SubCategoryId,
        CustomId,
        AddedBy:_id
    }
    const DBbrand=await BrandModel.create(BrandObject)
    if(!DBbrand){
try{
    await cloudinary.uploader.destroy(public_id)

}catch(error){
    console.log(error);
}
        return next(new Error('try again later',{cause:400}))
    }
    res.status(200).json({
        message:'Brand Created successfully',
        DBbrand
    })
}catch(error){
    console.log(error);
}
    
}
/*delete Brand*/
export const deleteBrand = async (req, res, next) => {
    const { subcategoryID, categoryId ,BrandId} = req.query
    const IsBrandExist =await BrandModel.findByIdAndDelete({_id:BrandId})
    if(!IsBrandExist){
        return next(new Error("invalid brand id",{cause:400}))
    }
    const category = await categoryModel.findById({ _id: categoryId })
    if(!category){
        return next(new Error('inavlid id',{cause:400}))
    }
    const SubCatExist = await SubCategoryModel.findById(subcategoryID)
    if (!SubCatExist) {
        return next(new Error('invalid id', { cause: 400 }))
    }

    /*
    const deleteRelatedProducts = await productModel.deleteMany({
        categoryId
    })
    if (!deleteRelatedProducts.deletedCount) {
        return next(new Error('delete fail products', { cause: 400 }))
    }*/
    try {
        await cloudinary.uploader.destroy(IsBrandExist.logo.public_id)
try {
            await cloudinary.api.delete_folder(`${process.env.PROJECT_FOLDER}/Categories/${category.CustomId}/SubCategories/${SubCatExist.CustomId}/Brands`)
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
/*update Brand*/
export const updateBrand = async (req, res, next) => {
    const { _id } = req.authUser
    const { name, BrandId ,categoryId,SubCategoryId } = req.query
    const category=await categoryModel.findById({_id:categoryId})
    const SubCategory=await SubCategoryModel.findById({_id:SubCategoryId})
    if(!SubCategory ||!category){
        return next (new Error('invalid id',{cause:400}))
    }
    const brand = await BrandModel.findById({ _id: BrandId })
    if (!brand) {
        return next(new Error('invalid id', { cause: 400 }))
    }
    const brandName = await BrandModel.findOne({name})
    if (name) {
        if (brandName) {
            console.log({NAME:brand.name,name});
            return next(new Error('this name already exists', { cause: 400 }))
        }
        brand.name = name
        brand.slug=slugify(name,'-')
    }
    if (req.file) {
        try {
            await cloudinary.uploader.destroy(brand.logo.public_id)
        try {
            const { secure_url, public_id } = await cloudinary.uploader.upload(
                req.file.path,
                {
                    folder: `${process.env.PROJECT_FOLDER}/Categories/${category.CustomId}/SubCategories/${SubCategory.CustomId}/Brands/${brand.CustomId}`
                }
            )
            brand.logo = { secure_url, public_id }

        } catch (error) {
            console.log(error);
        }

        } catch (error) {
           console.log(error);
        }
    }
    const newBrand = await brand.save()
    res.status(200).json({
        message:'subcategory was updated successfully',
        data:newBrand,
    })    
}
/*get All with prodicts*/
export const GetAllWProducts=async(req,res,next)=>{

}
