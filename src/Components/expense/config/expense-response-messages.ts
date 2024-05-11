import { BadRequestException, UnauthorizedException } from "@nestjs/common"; /**
 * status messages
 * ---------------------
 * Define all your possible custom status messages here.
 */

export const ExpenseStatusMessages = {
  default: "Ok",
  Create: {
    success: "Your expense was created successfully",
  },
  Update: {
    success: "Your expense was updated successfully",
  },
  Error: {
    category: {
      required: "Select a category to continue",
      notFound:
        "The category you selected is either inactive or does not exists",
    },
    subcategory: {
      required: "Select a subcategory to continue",
      notFound:
        "The subcategory you selected is either inactive or does not exists",
    },
    currency: {
      required: "Select a currency to continue",
      notFound:
        "The currency you selected is either inactive or does not exists",
    },
    expense: {
      notFound:
        "This expense was not found. It has either been moved or deleted",
    },
  },
};
