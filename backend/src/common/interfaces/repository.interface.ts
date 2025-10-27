export interface IRepository<T> {
  create(data: any): Promise<T>;
  findAll(options?: any): Promise<{ data: T[]; pagination?: any }>;
  findOne(id: string): Promise<T | null>;
  update(id: string, data: any): Promise<T>;
  remove(id: string): Promise<T>;
}
