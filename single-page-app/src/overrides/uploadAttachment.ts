import { gql } from 'graphql-request';

export const name = 'uploadAttachment';

export const query = gql`
  mutation uploadAttachment($file: Upload, $id: ID!, $identifierName: String) {
    addAttachment(file: $file, id: $id, identifierName: $identifierName) {
      id
      fileName
      fileURL
      mimeType
      fileSize
      identifierName
    }
  }
`;

export const resolver = 'addAttachment';

export const transform = undefined;

export default {
  name,
  query,
  resolver,
  transform,
};
