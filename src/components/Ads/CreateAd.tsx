import React, { useState, useRef } from 'react';
import { X, Upload, MapPin, DollarSign, Camera, Image as ImageIcon, AlertCircle, Phone } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { AdService } from '../../services/adService';
import { categories, syrianCities, conditions } from '../../data/mockData';

interface CreateAdProps {
  onClose: () => void;
  onCreateAd: (adData: any) => void;
  editingAd?: any;
  onUpdateAd?: (adData: any) => void;
}

const CreateAd: React.FC<CreateAdProps> = ({ 
  onClose, 
  onCreateAd, 
  editingAd,
  onUpdateAd 
}) => {
  const { t, isRTL } = useLanguage();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: editingAd?.title || '',
    description: editingAd?.description || '',
    price: editingAd?.price?.toString() || '',
    category: editingAd?.category || '',
    condition: editingAd?.condition || '',
    location: editingAd?.location || '',
    phone: editingAd?.user?.phone || user?.phone || '',
  });
  const [images, setImages] = useState<string[]>(editingAd?.images || []);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    
    // Ensure it starts with 09
    if (value.length > 0 && !value.startsWith('09')) {
      if (value.startsWith('9')) {
        value = '0' + value;
      } else if (!value.startsWith('0')) {
        value = '09' + value;
      } else {
        value = '09' + value.substring(1);
      }
    }
    
    // Limit to 10 digits
    if (value.length > 10) {
      value = value.substring(0, 10);
    }
    
    setFormData(prev => ({ ...prev, phone: value }));
    
    // Clear error when user starts typing
    if (errors.phone) {
      setErrors(prev => ({ ...prev, phone: '' }));
    }
  };
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const maxFiles = 8 - images.length;
    const filesToProcess = Array.from(files).slice(0, maxFiles);

    if (filesToProcess.length === 0) {
      setErrors(prev => ({ ...prev, images: 'يمكنك رفع 8 صور كحد أقصى' }));
      return;
    }

    // Clear previous errors
    setErrors(prev => ({ ...prev, images: '' }));

    // Initialize progress tracking
    const newProgress = new Array(filesToProcess.length).fill(0);
    setUploadProgress(newProgress);

    const newImages: string[] = [];

    for (let i = 0; i < filesToProcess.length; i++) {
      const file = filesToProcess[i];
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, images: 'يرجى اختيار ملفات صور فقط' }));
        continue;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, images: 'حجم الصورة يجب أن يكون أقل من 5 ميجابايت' }));
        continue;
      }

      try {
        // Simulate upload progress
        for (let progress = 0; progress <= 100; progress += 20) {
          await new Promise(resolve => setTimeout(resolve, 100));
          setUploadProgress(prev => {
            const updated = [...prev];
            updated[i] = progress;
            return updated;
          });
        }

        // رفع الصورة إلى Supabase أو تحويلها إلى base64 للمعاينة
        try {
          // في بيئة الإنتاج، استخدم AdService.uploadImages([file])
          // const uploadedUrls = await AdService.uploadImages([file]);
          // newImages.push(uploadedUrls[0]);
          
          // للآن، نستخدم base64 للمعاينة
          const reader = new FileReader();
          reader.onload = (event) => {
            if (event.target?.result) {
              newImages.push(event.target.result as string);
              if (newImages.length === filesToProcess.length) {
                setImages(prev => [...prev, ...newImages]);
                setUploadProgress([]);
              }
            }
          };
          reader.readAsDataURL(file);
        } catch (uploadError) {
          console.error('Error uploading image:', uploadError);
          setErrors(prev => ({ ...prev, images: 'فشل في رفع الصورة' }));
        }
      } catch (error) {
        console.error('Error uploading image:', error);
        setErrors(prev => ({ ...prev, images: 'حدث خطأ أثناء رفع الصورة' }));
      }
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setErrors(prev => ({ ...prev, images: '' }));
    
    // Reset file input to allow re-uploading the same file
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.title.trim()) {
      newErrors.title = 'عنوان الإعلان مطلوب';
    } else if (formData.title.length < 5) {
      newErrors.title = 'العنوان يجب أن يكون 5 أحرف على الأقل';
    } else if (formData.title.length > 100) {
      newErrors.title = 'العنوان يجب أن يكون أقل من 100 حرف';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'الوصف مطلوب';
    } else if (formData.description.length < 20) {
      newErrors.description = 'الوصف يجب أن يكون 20 حرف على الأقل';
    } else if (formData.description.length > 1000) {
      newErrors.description = 'الوصف يجب أن يكون أقل من 1000 حرف';
    }

    if (!formData.price) {
      newErrors.price = 'السعر مطلوب';
    } else if (parseFloat(formData.price) <= 0) {
      newErrors.price = 'السعر يجب أن يكون أكبر من صفر';
    } else if (parseFloat(formData.price) > 999999999) {
      newErrors.price = 'السعر كبير جداً';
    }

    if (!formData.category) {
      newErrors.category = 'الفئة مطلوبة';
    }

    if (!formData.condition) {
      newErrors.condition = 'الحالة مطلوبة';
    }

    if (!formData.location) {
      newErrors.location = 'المدينة مطلوبة';
    }

    if (!formData.phone) {
      newErrors.phone = 'رقم الجوال مطلوب';
    } else if (!formData.phone.startsWith('09')) {
      newErrors.phone = 'رقم الجوال يجب أن يبدأ بـ 09';
    } else if (formData.phone.length !== 10) {
      newErrors.phone = 'رقم الجوال يجب أن يتكون من 10 أرقام';
    }
    if (images.length === 0) {
      newErrors.images = 'يجب إضافة صورة واحدة على الأقل';
    } else if (images.length > 8) {
      newErrors.images = 'لا يمكن رفع أكثر من 8 صور';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    if (!user) {
      setErrors({ submit: 'يجب تسجيل الدخول أولاً' });
      return;
    }

    // التحقق النهائي من الصور
    if (images.length === 0) {
      setErrors({ images: 'يجب إضافة صورة واحدة على الأقل' });
      return;
    }
    setIsLoading(true);

    try {
      if (editingAd && onUpdateAd) {
        // تحديث إعلان موجود
        const updatedAd = await AdService.updateAd(editingAd.id, {
          title: formData.title,
          description: formData.description,
          price: parseFloat(formData.price.replace(/,/g, '')),
          images,
          category: formData.category,
          condition: formData.condition as any,
          location: formData.location,
        }, user.id);
        
        onUpdateAd({
          ...editingAd,
          ...updatedAd,
          user,
        });
      } else {
        // إنشاء إعلان جديد
        const newAd = await AdService.createAd({
          title: formData.title,
          description: formData.description,
          price: parseFloat(formData.price.replace(/,/g, '')),
          images,
          category: formData.category,
          condition: formData.condition as any,
          location: formData.location,
        }, user.id);
        
        onCreateAd({
          ...newAd,
          user,
          comments: [],
          commentsCount: 0,
        });
      }
      
      onClose();
    } catch (error) {
      console.error('Error creating ad:', error);
      setErrors({ submit: 'حدث خطأ أثناء حفظ الإعلان. يرجى المحاولة مرة أخرى.' });
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (value: string) => {
    // Remove non-numeric characters except decimal point
    const numericValue = value.replace(/[^\d.]/g, '');
    // Format with thousands separator
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const formatted = formatPrice(value);
    setFormData(prev => ({ ...prev, price: formatted }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[95vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-blue-50 to-blue-100">
          <h2 className="text-2xl font-bold text-gray-900">إضافة إعلان جديد</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-full transition-all"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Phone Number */}
        <div className="space-y-2">
          <label htmlFor="phone" className="block text-sm font-semibold text-gray-700">
            رقم الجوال *
          </label>
          <div className="relative">
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handlePhoneChange}
              className={`w-full pr-4 pl-12 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-right ${
                errors.phone ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300'
              }`}
              placeholder="09xxxxxxxx"
              dir="rtl"
              maxLength={10}
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1 space-x-reverse text-gray-500">
              <Phone className="h-5 w-5" />
              <span className="text-sm font-medium">+963</span>
            </div>
          </div>
          <div className="text-xs text-gray-500">
            يجب أن يبدأ الرقم بـ 09 ويتكون من 10 أرقام
          </div>
          {errors.phone && (
            <div className="flex items-center space-x-2 space-x-reverse text-red-600 text-sm">
              <AlertCircle className="h-4 w-4" />
              <span>{errors.phone}</span>
            </div>
          )}
        </div>
        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <label htmlFor="title" className="block text-sm font-semibold text-gray-700">
              عنوان الإعلان *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-right ${
                errors.title ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300'
              }`}
              placeholder="مثال: آيفون 13 برو - حالة ممتازة"
              dir="rtl"
            />
            {errors.title && (
              <div className="flex items-center space-x-2 space-x-reverse text-red-600 text-sm">
                <AlertCircle className="h-4 w-4" />
                <span>{errors.title}</span>
              </div>
            )}
          </div>

          {/* Images Upload */}
          <div className="space-y-4">
            <label className="block text-sm font-semibold text-gray-700">
              الصور * (حتى 8 صور)
            </label>
            
            {/* Upload Area */}
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-blue-400 hover:bg-blue-50 transition-all">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-blue-100 rounded-full">
                    <Camera className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  اختر الصور
                </button>
                <p className="text-sm text-gray-500 mt-2">
                  أو اسحب الصور هنا • PNG, JPG, WEBP • حتى 5MB لكل صورة
                </p>
              </div>
            </div>

            {/* Upload Progress */}
            {uploadProgress.length > 0 && (
              <div className="space-y-2">
                {uploadProgress.map((progress, index) => (
                  <div key={index} className="bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Image Preview Grid */}
            {images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`رفع ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg border-2 border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -left-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <div className="absolute bottom-1 right-1 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                      {index + 1}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {errors.images && (
              <div className="flex items-center space-x-2 space-x-reverse text-red-600 text-sm">
                <AlertCircle className="h-4 w-4" />
                <span>{errors.images}</span>
              </div>
            )}
          </div>

          {/* Category and Condition */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="category" className="block text-sm font-semibold text-gray-700">
                الفئة *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-right ${
                  errors.category ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                }`}
                dir="rtl"
              >
                <option value="">اختر الفئة</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {errors.category && (
                <div className="flex items-center space-x-2 space-x-reverse text-red-600 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  <span>{errors.category}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="condition" className="block text-sm font-semibold text-gray-700">
                الحالة *
              </label>
              <select
                id="condition"
                name="condition"
                value={formData.condition}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-right ${
                  errors.condition ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                }`}
                dir="rtl"
              >
                <option value="">اختر الحالة</option>
                {conditions.map(condition => (
                  <option key={condition.value} value={condition.value}>
                    {condition.label}
                  </option>
                ))}
              </select>
              {errors.condition && (
                <div className="flex items-center space-x-2 space-x-reverse text-red-600 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  <span>{errors.condition}</span>
                </div>
              )}
            </div>
          </div>

          {/* Price and Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="price" className="block text-sm font-semibold text-gray-700">
                السعر (ليرة سورية) *
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handlePriceChange}
                  className={`w-full pr-4 pl-12 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-right ${
                    errors.price ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  placeholder="مثال: 1,500,000"
                  dir="rtl"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1 space-x-reverse text-gray-500">
                  <DollarSign className="h-5 w-5" />
                  <span className="text-sm font-medium">ل.س</span>
                </div>
              </div>
              {errors.price && (
                <div className="flex items-center space-x-2 space-x-reverse text-red-600 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  <span>{errors.price}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="location" className="block text-sm font-semibold text-gray-700">
                المدينة *
              </label>
              <div className="relative">
                <select
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-right appearance-none ${
                    errors.location ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  dir="rtl"
                >
                  <option value="">اختر المدينة</option>
                  {syrianCities.map(city => (
                    <option key={city} value={`${city}، سوريا`}>
                      {city}
                    </option>
                  ))}
                </select>
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
              {errors.location && (
                <div className="flex items-center space-x-2 space-x-reverse text-red-600 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  <span>{errors.location}</span>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-semibold text-gray-700">
              الوصف *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={5}
              className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-right resize-none ${
                errors.description ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300'
              }`}
              placeholder="اكتب وصفاً مفصلاً للمنتج... اذكر المميزات، الحالة، سبب البيع، وأي تفاصيل مهمة أخرى"
              dir="rtl"
            />
            <div className="flex justify-between items-center text-sm text-gray-500">
              <span>{formData.description.length} حرف</span>
              <span>الحد الأدنى: 20 حرف</span>
            </div>
            {errors.description && (
              <div className="flex items-center space-x-2 space-x-reverse text-red-600 text-sm">
                <AlertCircle className="h-4 w-4" />
                <span>{errors.description}</span>
              </div>
            )}
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center space-x-2 space-x-reverse text-red-600">
                <AlertCircle className="h-5 w-5" />
                <span>{errors.submit}</span>
              </div>
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4 space-x-reverse pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors font-medium"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg flex items-center space-x-2 space-x-reverse"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  <span>جاري النشر...</span>
                </>
              ) : (
                <>
                  <Upload className="h-5 w-5" />
                  <span>نشر الإعلان</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAd;