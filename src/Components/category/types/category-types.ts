import { GlobalRequestResponse } from "../../globals/global.types";
import { UserProfileType } from "../../user/types/user.types";
import { SubcategoriesModel } from "../model/subcatgories.model";
import { CategoriesModel } from "../model/categories.model";

export interface Subcategory {
  id: number;
  name: string;
  categoryId: number;
  color: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

export interface CreateSuggestedCategory {
  name: string;
  description?: string;
  userId: number;
}

export interface CreateSuggestedSubcategory {
  name: string;
  description?: string;
  userId: number;
  categoryId: number;
}

export interface SuggestedSubcategory {
  id: number;
  name: string;
  description: string;
  userId: number;
  categoryId: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

export interface SuggestedCategory {
  id: number;
  name: string;
  userId: number;
  description?: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

export interface CategoryTypeForAdmin {
  id: number;
  name: string;
  isUserDefinedCategory: boolean;
  isCategoryActive: boolean;
  userId?: number;
  icon: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  customer: UserProfileType;
  subcategories?: SubcategoriesForAdmin[];
}

export interface SubcategoriesForAdmin {
  id: number;
  name: string;
  isUserDefinedSubcategory: boolean;
  isSubcategoryActive: boolean;
  categoryId: number;
  userId: number;
  color: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  category: CategoryTypeForAdmin;
  customer: UserProfileType;
}

export interface CategoryTypeForCustomer {
  id: number;
  name: string;
  isUserDefinedCategory: boolean;
  isCategoryActive: boolean;
  userId?: null | number | UserProfileType;
  subcategories?: SubcategoriesForAdmin[];
  icon: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

export interface UpdateCategory {
  name?: string;
  isCategoryActive?: boolean;
  icon?: string;
  color?: string;
}

export interface CreateCategoryType {
  name: string;
  isUserDefinedCategory: boolean;
  isCategoryActive: boolean;
  userId?: null | number;
  icon: string;
  color: string;
}

export interface CreateSubcategoryType {
  name: string;
  isUserDefinedSubcategory: boolean;
  isSubcategoryActive: boolean;
  categoryId: number;
  userId?: null | number;
  color: string;
}

export interface ListCategoriesForAdminResponse extends GlobalRequestResponse {
  data: CategoriesModel[];
}

export interface ListCategoriesForCustomerResponse
  extends GlobalRequestResponse {
  data: CategoriesModel[];
}

export interface CreateSuggestedCategoryResponse extends GlobalRequestResponse {
  data: SuggestedCategory;
}

export interface CreateSuggestedSubcategoryResponse
  extends GlobalRequestResponse {
  data: SuggestedSubcategory | Subcategory;
}

export interface ListSuggestedSubcategoriesForAdminResponse
  extends GlobalRequestResponse {
  data: SuggestedSubcategory[];
}

export interface ListSuggestedCategoriesForAdminResponse
  extends GlobalRequestResponse {
  data: SuggestedCategory[];
}

export interface CreateCategoryResponse extends GlobalRequestResponse {
  data: CategoriesModel;
}

export interface CreateSubcategoryResponse extends GlobalRequestResponse {
  data: SubcategoriesModel;
}

export interface CategoryDefaultResponse extends GlobalRequestResponse {}
