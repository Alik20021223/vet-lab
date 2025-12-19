import { api, prepareFormData } from '../store/api';

export interface UploadImageResponse {
  url: string;
  filename: string;
  size: number;
}

export interface UploadDocumentResponse {
  data: {
    url: string;
    filename: string;
    size: number;
    mimeType: string;
  };
}

export const uploadService = api.injectEndpoints({
  endpoints: (builder) => ({
    uploadImage: builder.mutation<UploadImageResponse, File>({
      query: (file) => {
        const formData = new FormData();
        formData.append('file', file);
        return {
          url: '/upload/image',
          method: 'POST',
          body: formData,
        };
      },
    }),
    uploadDocument: builder.mutation<UploadDocumentResponse, File>({
      query: (file) => {
        const formData = new FormData();
        formData.append('file', file);
        return {
          url: '/upload/document',
          method: 'POST',
          body: formData,
        };
      },
    }),
  }),
});

export const { useUploadImageMutation, useUploadDocumentMutation } = uploadService;


