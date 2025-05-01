import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, ImageIcon } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { useCallback, useEffect, useState } from "react";

function ImagePicker({
  title,
  imageName,
  multiple = false,
  onChange,
  onChangeInitialImages,
  image_urls = [],
}) {
  const [selectedImages, setSelectedImages] = useState([]);
  const [initialImages, setInitialImages] = useState(image_urls);

  // Update initialImages only if image_urls changes
  useEffect(() => {
    if (JSON.stringify(initialImages) !== JSON.stringify(image_urls)) {
      setInitialImages(image_urls);
    }
  }, [image_urls]);

  const onDrop = useCallback(
    (acceptedFiles) => {
      if (multiple) {
        const newImages = [...selectedImages, ...acceptedFiles];
        setSelectedImages(newImages);
        if (onChange) onChange(newImages);
      } else {
        const newImages = acceptedFiles.slice(0, 1); // Only the first file
        setSelectedImages(newImages);
        if (onChange) onChange(newImages);
      }
    },
    [multiple, selectedImages, onChange]
  );

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [], // Accept all image types
    },
    multiple, // Use the `multiple` prop here
    onDrop,
  });

  const removeImage = (index) => {
    const updatedImages = selectedImages.filter((_, i) => i !== index);
    setSelectedImages(updatedImages);
    if (onChange) onChange(updatedImages);
  };

  const removeImageUrl = (index) => {
    const updatedInitialImages = initialImages.filter((_, i) => i !== index);
    setInitialImages(updatedInitialImages);
    if (onChangeInitialImages) onChangeInitialImages(updatedInitialImages);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>{imageName}</Label>
          <div {...getRootProps({ className: "dropzone" })}>
            <div className="border-2 border-dashed rounded-lg p-8 text-center space-y-4">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <ImageIcon className="h-6 w-6 text-primary" />
              </div>
              <div className="text-sm text-muted-foreground">
                Drag and drop image here, or click add image
              </div>
              <div>
                <input {...getInputProps()} />
                <Button variant="secondary" size="sm">
                  Add Image
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {/* Render initial images */}
          {initialImages?.length > 0 && initialImages?.map((image, index) => (
            <div
              key={`initial-${index}`}
              className="relative group border border-gray-200 rounded-lg overflow-hidden dark:border-gray-700"
            >
              <div className="aspect-square overflow-hidden rounded-lg">
                <img
                  src={image}
                  alt={`Preview ${index + 1}`}
                  width={300}
                  height={300}
                  className="object-cover w-full h-full"
                />
              </div>
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeImageUrl(index)}
                aria-label={`Remove image ${index + 1}`}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          {/* Render selected images */}
          {selectedImages?.map((image, index) => (
            <div
              key={`selected-${index}`}
              className="relative group border border-gray-200 rounded-lg overflow-hidden dark:border-gray-700"
            >
              <div className="aspect-square overflow-hidden rounded-lg">
                <img
                  src={URL.createObjectURL(image)}
                  alt={`Preview ${index + 1}`}
                  width={300}
                  height={300}
                  className="object-cover w-full h-full"
                />
              </div>
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeImage(index)}
                aria-label={`Remove image ${index + 1}`}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default ImagePicker;
