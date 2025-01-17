export type TServerActionError = {
  code: string,
  message: string,
}

export type TAttributeEditProps = {
  language: TLanguage;
  componentAttribute: any;
  onChange: (value: any) => void;
  onUploadImage: (value: FormData) => any;
  projectID: string;
  getImages: (body: {
      projectID: string;
      type: "user" | "system";
  }) => Promise<{
      data: string[] | null;
      error: TServerActionError | null;
  }>
};

export type TLanguage = 'en' | 'cn';

export type TLocales = {
  [key: string]: {
    [key: string]: string;
  };
}
