declare module 'react-native/Libraries/Types/CodegenTypes' {
  export type EventEmitter<T> = (
    listener: (payload: T) => void
  ) => { remove: () => void };
}
