import React from 'react';
import { render } from '@testing-library/react-native';
import ImageChat from '../../../src/components/chat/ImageChat';

describe('ImageChat Component', () => {
  it('should render an image preview', () => {
    const uri = 'MOCK_IMAGE_URL';
    const type = 'image/png';

    const { getByTestId } = render(
      <ImageChat uri={uri} type={type} />
    );

    const imagePreview = getByTestId('image_preview');
    expect(imagePreview).toBeTruthy();
  });

  it('should render a play icon for video type', () => {
    const uri = 'MOCK_VIDEO_URL';
    const type = 'video/mp4';

    const { getByTestId } = render(
      <ImageChat uri={uri} type={type} />
    );

    const imagePreview = getByTestId('image_preview');
    const playIcon = getByTestId('icon_play');

    expect(imagePreview).toBeTruthy();
    expect(playIcon).toBeTruthy();
  });

  it('should not render a play icon for non-video type', () => {
    const uri = 'MOCK_IMAGE_URL';
    const type = 'image/png';

    const { queryByTestId } = render(
      <ImageChat uri={uri} type={type} />
    );

    const imagePreview = queryByTestId('image_preview');
    const playIcon = queryByTestId('icon_play');

    expect(imagePreview).toBeTruthy();
    expect(playIcon).toBeNull();
  });
});
