/**
 * status messages
 * ---------------------
 * Define all your possible custom status messages here.
 */

export const CategoryStatusMessages = {
  default: "Ok",
  Create: {
    success: "Category was created successfully",
  },
  Status: {
    exists: "This category exists",
    doesNotExists: "This category does not exists",
    userIdUnavailable: "Kindly provide user ID",
  },
  Update: {
    success: "Category updated successfully",
  },
  Subcategory: {
    exists: "This subcategory exists",
    doesNotExists: "This subcategory does not exists",
    success: "Subcategory was created successfully",
  },
  Suggestions: {
    category: {
      create:
        "Your suggestion has been recorded. It will be reviewed and approved.",
      delete: "Suggested category deleted successfully",
    },
    subcategory: {
      create:
        "Your suggestion has been recorded. It will be reviewed and approved.",
      delete: "Suggested subcategory deleted successfully",
    },
  },
};
