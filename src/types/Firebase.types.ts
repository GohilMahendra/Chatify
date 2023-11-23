export type docType<T> = 
{
    data:()=>T | undefined,
    id: string,
    exists: boolean   
}
export type docSnapType<T>=
{
    docs:docType<T>,
    exists: boolean  
}
export type quarySnapType<T> = 
{
    docs:docType<T>[],
    exists: boolean
}