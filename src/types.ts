import { ReactNode } from "react";

export type Member = {
  email: string;
  pw: string;
  nickname: string;
  social: boolean;
  accessToken: string;
  refreshToken: string;
  roleNames: string[];
} // MemberDTO + accessToken + refreshToken

export type LoginParam = Pick<Member, "email" | "pw">;
export type LoginFail = {
  error: string;
}
export type MemberModify = Pick<Member, "email" | "nickname" | "pw">;

export type OmitMemberInfo = Omit<Member, "pw" | "roleNames">;

export type MemberEmail = Pick<Member, "email">;

export type JoinForm = {
  email: string;
  pw: string;
  pwConfirm: string;
  nickname: string;
  roleNames?: string[];
}

export type Product = {
  pno: number;
  pname: string;
  price: number;
  pdesc: string;
  delFlag: boolean;
  // files: File[];
  uploadFileNames: string[];
}

export type ProductPnoType = Product['pno'];
export type SimpleProduct = Omit<Product, "delFlag">;

export type ProductForm = {
  pname: string;
  price: number;
  pdesc: string;
  files: File[];
}
export type ProductReadComponentProps = {
  pno: number;
};
export type CartItem = {
  email: string;
  pno: number;
  qty: number;
  cino?: number;
}
export type CartItemList = {
  cino: number;
  qty: number;
  pno: number;
  pname: string;
  price: number;
  imageFile: string;

}
export type CartItemComponentProps =  {
  cino: number,
  pname : string,
  price: number,
  pno: number,
  qty: number,
  imageFile :string,
  // changeCart: (id: number, qty: number) => void;
  changeCart: (param: CartItem) => void
  email: string;
}

export type PageRequest = {
  page: number;
  size?: number;
}


export type Todo = {
  tno: number;
  title: string;
  writer: string;
  complete: boolean;
  dueDate: string | null;
}

export type TodoTnoType = Todo['tno'];

export type SimpleTodo = Omit<Todo, "tno" | "complete">;

export type TodoReadComponentProps = {
  tno: number;
};

export type ResultModalProps = {
  title: string;
  content: string;
  callbackFn?: () => void;
}

export type PageResponse<T> = {
  dtoList: T[];
  pageNumList: number[];
  pageRequestDTO: PageRequest | null;
  prev: boolean;
  next: boolean;
  totalCount: number;
  prevPage: number;
  nextPage: number;
  totalPage: number;
  current: number;
}

export type PageComponentProps<T> = {
  serverData: PageResponse<T>;
  // movePage: (page: number) => void | any;
  movePage: any;
}

export type BasicLayoutProps = {
  children: ReactNode;
}