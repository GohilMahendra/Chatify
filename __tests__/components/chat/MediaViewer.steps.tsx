import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import MediaViewer, { MediaViewerProps } from '../../../src/components/chat/MediaViewer';
import { act } from 'react-test-renderer';

// Mock the necessary dependencies
jest.mock('react-native-video', () => 'Video');

const onCloseMock = jest.fn();

describe('MediaViewer Component', () => {
  it('should render an image when type is "image"', () => {
    const props: MediaViewerProps= {
        onClose: jest.fn(),
        type:"image/png",
        uri:"fake_uri"
    }
    const { getByTestId } = render(<MediaViewer {...props} />);

    const imageViewer = getByTestId('image_viewer');
    expect(imageViewer).toBeTruthy();
  });

  it('should render a video when type is "video"', async() => {
    const props: MediaViewerProps = {
        onClose: jest.fn(),
        type:"video/mp4",
        uri:"fake_video_url"
    }
    const { getByTestId } = render(<MediaViewer {...props} />);

    const video = getByTestId('video_viewer');
    act(()=>{
      fireEvent(video,"onLoad",{
        duration:20
      })
      fireEvent(video,"onProgress",{
        currentTime:10
      })
      fireEvent(video,"onEnd")
    })
  });


});
