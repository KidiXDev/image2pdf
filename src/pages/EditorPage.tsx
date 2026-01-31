import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GridViewC from '../components/GridViewC';
import HeaderC from '../components/HeaderC';
import { useImageUpload } from '../hooks/useImageUpload';
import { useImageStore } from '../stores/imageStore';

const EditorPage = () => {
  const { open } = useImageUpload();
  const { imageIsInputed } = useImageStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!imageIsInputed) {
      navigate('/');
    }
  }, [imageIsInputed, navigate]);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <HeaderC />
      <GridViewC onAddMoreImages={open} />
    </div>
  );
};

export default EditorPage;
