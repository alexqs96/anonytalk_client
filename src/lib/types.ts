export type setStateType<T> = React.Dispatch<React.SetStateAction<T>>;

export interface IUser {
  color: string;
  nick: string;
  room: string;
  colorIcon: string | null
}

export interface IMessage{
  id: string;
  room: string;
  files: string[];
  author: string;
  color: string;
  message: string;
  time: Date;
}
