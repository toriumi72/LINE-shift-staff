import type { UserInfo, IdTokenResult } from 'firebase/auth'

export type LoggedInUser = {
  uid: string | null
  name: string | null,
  imageUrl: string | null,
  createAt: Date,
  updateAt: Date,
}

export enum CheckMark {
  CIRCLE,
  // TRIANGLE,
  CROSS
}

export type DayData = {
  cdate: any,
  date: number,
  checkMark: CheckMark,
  start: {
    hour: number,
    minute: number,
  },
  end: {
    hour: number,
    minute: number,
  }
}