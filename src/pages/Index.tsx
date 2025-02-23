
import React, { useState } from 'react';
import { ImageUpload } from '@/components/ImageUpload';
import { ROIAnalysis } from '@/components/ROIAnalysis';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

// Mock data - replace with actual API call later
const mockApiResponse = async (file: File, acquisitionCost: number) => {
  try {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('acquisitionCost', acquisitionCost.toString());

    // TODO: Replace with your actual API endpoint
    const response = await fetch('/api/analyze', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Analysis failed');
    }

    // For now, return mock data until API is connected
    const calculateROI = (sellingPrice: number, fees: number) => {
      const profit = sellingPrice - acquisitionCost - fees;
      const roi = (profit / acquisitionCost) * 100;
      return { profit, roi };
    };

    const lowPrice = 25.00;
    const medPrice = 45.00;
    const highPrice = 75.00;

    const lowFees = lowPrice * 0.13;
    const medFees = medPrice * 0.13;
    const highFees = highPrice * 0.13;

    const lowROI = calculateROI(lowPrice, lowFees);
    const medROI = calculateROI(medPrice, medFees);
    const highROI = calculateROI(highPrice, highFees);

    return {
      options: [
        {
          type: 'Low',
          sellingPrice: lowPrice,
          fees: lowFees,
          profit: lowROI.profit,
          roi: lowROI.roi,
        },
        {
          type: 'Medium',
          sellingPrice: medPrice,
          fees: medFees,
          profit: medROI.profit,
          roi: medROI.roi,
        },
        {
          type: 'High',
          sellingPrice: highPrice,
          fees: highFees,
          profit: highROI.profit,
          roi: highROI.roi,
        },
      ],
    };
  } catch (error) {
    console.error('Analysis error:', error);
    throw error;
  }
};

const approveListingApi = async (option: any, imageFile: File) => {
  try {
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('listingData', JSON.stringify(option));

    // TODO: Replace with your actual API endpoint
    const response = await fetch('/api/approve-listing', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to approve listing');
    }

    return await response.json();
  } catch (error) {
    console.error('Approval error:', error);
    throw error;
  }
};

const saveForLaterApi = async (option: any, imageFile: File) => {
  try {
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('listingData', JSON.stringify(option));

    // TODO: Replace with your actual API endpoint
    const response = await fetch('/api/save-listing', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to save listing');
    }

    return await response.json();
  } catch (error) {
    console.error('Save error:', error);
    throw error;
  }
};

const Index = () => {
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentImageFile, setCurrentImageFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleImageUpload = async (file: File, acquisitionCost: number) => {
    setIsLoading(true);
    setCurrentImageFile(file);
    try {
      const response = await mockApiResponse(file, acquisitionCost);
      setAnalysisResults(response);
      toast({
        title: "Analysis Complete",
        description: "Review the ROI options below",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to analyze image",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (option: any) => {
    if (!currentImageFile) {
      toast({
        title: "Error",
        description: "Image data not found",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await approveListingApi(option, currentImageFile);
      toast({
        title: "Listing Approved",
        description: `Item will be listed at $${option.sellingPrice}`,
      });
      // Reset the form after successful approval
      setAnalysisResults(null);
      setCurrentImageFile(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve listing",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveForLater = async (option: any) => {
    if (!currentImageFile) {
      toast({
        title: "Error",
        description: "Image data not found",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await saveForLaterApi(option, currentImageFile);
      toast({
        title: "Saved for Later",
        description: "Item has been saved to your drafts",
      });
      // Reset the form after successful save
      setAnalysisResults(null);
      setCurrentImageFile(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save listing",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl space-y-8">
      <div className="text-center space-y-4 animate-fadeIn">
        <h1 className="text-4xl font-bold">eBay ROI Analyzer</h1>
        <p className="text-muted-foreground">
          Upload an image and enter acquisition cost to analyze potential ROI
        </p>
      </div>

      <Card className="p-6 animate-slideIn">
        <ImageUpload onImageUpload={handleImageUpload} />
      </Card>

      {isLoading && (
        <div className="text-center py-12 animate-pulse">
          <p className="text-muted-foreground">Analyzing image...</p>
        </div>
      )}

      {analysisResults && !isLoading && (
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">ROI Analysis</h2>
          <ROIAnalysis
            options={analysisResults.options}
            onApprove={handleApprove}
            onSaveForLater={handleSaveForLater}
          />
        </div>
      )}
    </div>
  );
};

export default Index;
