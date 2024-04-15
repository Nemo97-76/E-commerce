export const paginationFunc=({page=1,size=2})=>{
    if(page<1)page=1
    if(page<1)size=2
    const limit=size
    const skip=(page-1)*size
return {limit,skip}
}