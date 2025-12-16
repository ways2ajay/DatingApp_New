export type Member = {
  id: string
  dateOfBirth: string
  imageUrl?: string
  displayName: string
  created: string
  lastActive: string
  gender: string
  description?: string
  city: string
  country: string
}

export type Photo= {
  id: number
  url: string
  publicId?: any
  memberId: string
}

export type ApiResponse<T> = {
  result: T;
  id: number;
  exception: any;
  status: number;
  isCanceled: boolean;
  isCompleted: boolean;
  isCompletedSuccessfully: boolean;
  creationOptions: number;
  asyncState: any;
  isFaulted: boolean;
}

export type EditableMember ={
  displayName: string,
  description?: string,
  city: string,
  country:string
}