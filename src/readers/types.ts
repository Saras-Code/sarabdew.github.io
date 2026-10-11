export type ReaderHandle = {
  goTo: (index: number) => void;
  next: () => void;
  prev: () => void;
};

export type ReaderProps = {
  pages: React.ReactElement[];
  start: number;
  onChange: (visible: number[]) => void;
};
