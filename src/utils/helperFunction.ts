import { format } from "date-fns";
import { formatDistance } from "date-fns";
import { customAlphabet } from "nanoid";
import { enUS } from "date-fns/locale";
import { capitalize } from "./helpers";
import { toast } from "sonner";

export const CurrencyFormatter = (amount: number): string =>
  new Intl.NumberFormat("NGN", {
    style: "currency",
    currency: "NGN",
  }).format(amount || 0);

export const ErrorNotification = (error: string) => toast.error(error);
export const SuccessNotification = (message: string) =>
  toast.success(capitalize(message));

export const InvalidateTag = (id: string, typeTag: string) => {
  return [{ type: typeTag, id }];
};
export function truncateString(str: string, num: number) {
  if (str?.length > num) {
    return str?.slice(0, num) + "...";
  } else {
    return str;
  }
}

export function providesTagList<
  R extends { id: string | number }[],
  T extends string
>(resultsWithIds: R | undefined, tagType: T) {
  return resultsWithIds
    ? [
      { type: tagType, id: "LIST" },
      ...resultsWithIds.map(({ id }) => ({ type: tagType, id })),
    ]
    : [{ type: tagType, id: "LIST" }];
}

export function handleNotification(error: {
  data: any;
  status: string | number;
}) {
  switch (error.status) {
    case "FETCH_ERROR":
      ErrorNotification("Network Error! Please try again.");
      break;
    default:
      ErrorNotification(error?.data.error?.message || error?.data?.message);
      break;
  }
}

export function splitByUpperCase(str: string): string {
  const result = str
    .trim()
    .split(/(?=[A-Z])/)
    .join(" ")
    .trim();

  return result;
}

export const isObjectEmpty = (obj: typeof Object | any) =>
  obj === null || obj === undefined || Object.keys(obj).length === 0;

function descendingComparator<T>(a: T, b: T, sort: keyof T) {
  if (b[sort] < a[sort]) {
    return -1;
  }
  if (b[sort] > a[sort]) {
    return 1;
  }
  return 0;
}

type Order = "asc" | "desc";

export function getComparator<Key extends keyof any>(
  order: Order,
  sort: Key
): (
  _a: { [key in Key]: number | string | any },
  _b: { [key in Key]: number | string | any }
) => number {
  return order === "desc"
    ? (_a, _b) => descendingComparator(_a, _b, sort)
    : (_a, _b) => -descendingComparator(_a, _b, sort);
}

export function stableSort<T>(
  array: readonly T[],
  comparator: (a: T, b: T) => number
) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

export function handleDateFormat(date: string) {
  return format(new Date(date), "MMM d, yyyy hh:mm:ss");
}
export function handleFormatDate(date: any) {
  return format(new Date(date), "do MMM yyyy, hh:mm a", {
    locale: enUS,
  });
}

export function handleFormatNaira(amount: number) {
  const formattedAmount = Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  }).format(amount || 0);
  return formattedAmount;
}

export function convert2base64(file: any) {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      resolve(fileReader.result);
    };
    fileReader.onerror = (error) => {
      reject(error);
    };
  });
}

export function formatDateToSocialMediaStandard(date: number | Date) {
  const dateObj = date ? new Date(date) : new Date();
  return formatDistance(dateObj, new Date(), {
    addSuffix: true,
  });
}

export const ForgetPasswordKey = import.meta.env
  .VITE_FORGET_PASSWORD_SECRET_KEY;

interface CategoryType {
  fuel_purchase: string;
  wallet_transfer: string;
}

export const Category: CategoryType | any = {
  fuel_purchase: "Fuel purchase",
  wallet_transfer: "Wallet transfer",
};

interface ForEnumsType {
  stationBranch: string;
  stationHq: string;
  user: string;
}

export const forEnums: ForEnumsType | any = {
  stationBranch: "Station Branch",
  stationHq: "Station HQ",
  user: "User",
};

export const generatePassword = () => {
  const characters =
    "1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*";
  const pwdCharacters = customAlphabet(characters, 14);
  const pwd = pwdCharacters();
  return pwd;
};
