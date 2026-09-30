import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  Camera,
  Check,
  Edit3,
  Eye,
  EyeOff,
  FolderKanban,
  ImagePlus,
  KeyRound,
  LogOut,
  Package,
  Plus,
  RefreshCw,
  Search,
  Settings as SettingsIcon,
  Sparkles,
  Star,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { isFirebaseConfigured } from '../services/firebaseConfig';
import { HERO_BANNER_IMAGE } from '../data/initialCatalog';
import { CollectionItem, GarmentSize, Product } from '../types/store';
import { createFashionLookbookSvg } from '../utils/fashionArtworks';
import { processUploadedImageFile } from '../utils/imageUpload';
import { getEffectivePrice } from '../utils/whatsapp';
import { FashionImage } from './FashionImage';

interface AdminDashboardProps {
  onBackToStore: () => void;
}

const ALL_SIZES: GarmentSize[] = [
  'XS',
  'S',
  'M',
  'L',
  'XL',
  'XXL',
  'Free Size',
];

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onBackToStore,
}) => {
  const {
    products,
    collections,
    settings,
    isAdminAuthenticated,
    loginAdmin,
    logoutAdmin,
    addProduct,
    updateProduct,
    deleteProduct,
    addCollection,
    updateCollection,
    setCollectionPhoto,
    deleteCollection,
    updateSettings,
    resetCatalogToDefaults,
    updateAdminPassword,
  } = useStore();

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [activeTab, setActiveTab] = useState<
    'products' | 'collections' | 'photos' | 'settings'
  >('products');
  const [adminSearch, setAdminSearch] = useState('');
  const [adminCategory, setAdminCategory] = useState('All');

  const [photoUploadStatus, setPhotoUploadStatus] = useState('');
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  const DEFAULT_SLOT_ARTWORKS: Record<string, string> = {
    'col-pakistani-suits': '/images/collection-maria-b-suit.svg',
    'col-coord-sets': '/images/collection-coord-set.svg',
    'col-daily-wear': '/images/collection-daily-wear.svg',
    'col-party-wear': '/images/collection-ethnic-wear.svg',
    'col-bridal-wear': '/images/collection-pink-lehenga.svg',
    'hero-banner': '/images/hero-pakistani-suit.svg',
  };

  const handleSlotImageUpload = async (slotId: string, file: File) => {
    setIsUploadingPhoto(true);
    try {
      const dataUrl = await processUploadedImageFile(file, 1000, 0.88);
      if (slotId === 'hero-banner') {
        updateSettings({ heroImageUrl: dataUrl });
        setPhotoUploadStatus('Hero Banner Photo updated successfully!');
      } else {
        setCollectionPhoto(slotId, dataUrl);
        const col = collections.find((c) => c.id === slotId);
        setPhotoUploadStatus(`"${col?.name || 'Collection'}" photo updated successfully!`);
      }
      setTimeout(() => setPhotoUploadStatus(''), 4000);
    } catch (err) {
      console.error('Photo upload failed:', err);
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleResetSlotToDefault = (slotId: string) => {
    const defaultUrl = DEFAULT_SLOT_ARTWORKS[slotId];
    if (!defaultUrl) return;
    if (slotId === 'hero-banner') {
      updateSettings({ heroImageUrl: '' });
      setPhotoUploadStatus('Hero Banner restored to default studio artwork.');
    } else {
      setCollectionPhoto(slotId, defaultUrl);
      const col = collections.find((c) => c.id === slotId);
      setPhotoUploadStatus(`"${col?.name || 'Collection'}" restored to default studio artwork.`);
    }
    setTimeout(() => setPhotoUploadStatus(''), 4000);
  };

  const handleResetAllSlots = () => {
    Object.entries(DEFAULT_SLOT_ARTWORKS).forEach(([slotId, defaultUrl]) => {
      if (slotId === 'hero-banner') {
        updateSettings({ heroImageUrl: '' });
      } else {
        setCollectionPhoto(slotId, defaultUrl);
      }
    });
    setPhotoUploadStatus('All 6 photos successfully reset to pristine studio artworks!');
    setTimeout(() => setPhotoUploadStatus(''), 4000);
  };

  const handleBatch6PhotosUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setIsUploadingPhoto(true);
    try {
      const slotKeys = [
        'col-pakistani-suits',
        'col-coord-sets',
        'col-daily-wear',
        'col-party-wear',
        'col-bridal-wear',
        'hero-banner',
      ];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fname = file.name.toLowerCase();
        const dataUrl = await processUploadedImageFile(file, 1000, 0.88);

        if (fname.includes('maria') || fname.includes('elegent')) {
          setCollectionPhoto('col-pakistani-suits', dataUrl);
        } else if (
          fname.includes('pink') ||
          fname.includes('lahanga') ||
          fname.includes('lehenga')
        ) {
          setCollectionPhoto('col-bridal-wear', dataUrl);
        } else if (fname.includes('ethnic') || fname.includes('party')) {
          setCollectionPhoto('col-party-wear', dataUrl);
        } else if (fname.includes('coord') || fname.includes('19')) {
          setCollectionPhoto('col-coord-sets', dataUrl);
        } else if (fname.includes('daily') || fname.includes('7')) {
          setCollectionPhoto('col-daily-wear', dataUrl);
        } else if (
          fname.includes('20') ||
          fname.includes('hero') ||
          fname.includes('banner')
        ) {
          updateSettings({ heroImageUrl: dataUrl });
        } else if (i < slotKeys.length) {
          if (slotKeys[i] === 'hero-banner') {
            updateSettings({ heroImageUrl: dataUrl });
          } else {
            setCollectionPhoto(slotKeys[i], dataUrl);
          }
        }
      }
      setPhotoUploadStatus(
        `${files.length} Photos uploaded and saved across Store Collections & Hero Banner!`
      );
      setTimeout(() => setPhotoUploadStatus(''), 5000);
    } catch (err) {
      console.error('Batch upload error:', err);
    } finally {
      setIsUploadingPhoto(false);
      e.target.value = '';
    }
  };

  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('Pakistani Suits');
  const [formPrice, setFormPrice] = useState('2499');
  const [formSalePrice, setFormSalePrice] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formFabric, setFormFabric] = useState('Pure Lawn & Organza');
  const [formColor, setFormColor] = useState('Champagne & Gold');
  const [formSizes, setFormSizes] = useState<string[]>(['S', 'M', 'L', 'XL']);
  const [formImages, setFormImages] = useState<string[]>([]);
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [formAvailable, setFormAvailable] = useState(true);
  const [formFeatured, setFormFeatured] = useState(true);
  const [formNewArrival, setFormNewArrival] = useState(true);
  const [formActive, setFormActive] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [editingCollection, setEditingCollection] =
    useState<CollectionItem | null>(null);
  const [colName, setColName] = useState('');
  const [colSubtitle, setColSubtitle] = useState('');
  const [colImage, setColImage] = useState('');

  const [newAdminEmail, setNewAdminEmail] = useState(settings.adminEmail);
  const [newAdminPass, setNewAdminPass] = useState('');
  const [settingsSavedMsg, setSettingsSavedMsg] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const stats = useMemo(() => {
    const total = products.length;
    const featured = products.filter((p) => p.featured).length;
    const available = products.filter((p) => p.available).length;
    const outOfStock = products.filter((p) => !p.available).length;
    return { total, featured, available, outOfStock };
  }, [products]);

  const filteredAdminProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCat =
        adminCategory === 'All' ||
        p.category.toLowerCase() === adminCategory.toLowerCase();
      const q = adminSearch.trim().toLowerCase();
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.color.toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    });
  }, [products, adminCategory, adminSearch]);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    const res = loginAdmin(loginEmail, loginPassword);
    if (!res.success) {
      setLoginError(res.error || 'Authentication failed');
    }
  };

  const openCreateProductModal = () => {
    setEditingProduct(null);
    setFormName('');
    setFormCategory(collections[0]?.name || 'Pakistani Suits');
    setFormPrice('2999');
    setFormSalePrice('2499');
    setFormDescription(
      'Handcrafted luxury ensemble featuring fine zari and threadwork embroidery with matching bottoms and draped dupatta.'
    );
    setFormFabric('Pure Silk & Organza');
    setFormColor('Emerald & Champagne Gold');
    setFormSizes(['S', 'M', 'L', 'XL']);
    setFormImages([]);
    setCustomImageUrl('');
    setFormAvailable(true);
    setFormFeatured(true);
    setFormNewArrival(true);
    setFormActive(true);
    setIsProductModalOpen(true);
  };

  const openEditProductModal = (product: Product) => {
    setEditingProduct(product);
    setFormName(product.name);
    setFormCategory(product.category);
    setFormPrice(String(product.price));
    setFormSalePrice(product.salePrice ? String(product.salePrice) : '');
    setFormDescription(product.description);
    setFormFabric(product.fabric || 'Premium Ethnic Weave');
    setFormColor(product.color);
    setFormSizes(product.sizes.length > 0 ? product.sizes : ['Standard']);
    setFormImages(product.images);
    setCustomImageUrl('');
    setFormAvailable(product.available);
    setFormFeatured(product.featured);
    setFormNewArrival(product.newArrival);
    setFormActive(product.active);
    setIsProductModalOpen(true);
  };

  const handleProductImageFiles = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploadingImage(true);
    try {
      const uploadedUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const dataUrl = await processUploadedImageFile(files[i], 900, 0.84);
        uploadedUrls.push(dataUrl);
      }
      setFormImages((prev) => [...prev, ...uploadedUrls]);
    } catch (err) {
      console.error('Image upload error:', err);
    } finally {
      setUploadingImage(false);
      e.target.value = '';
    }
  };

  const handleAddImageUrl = () => {
    if (!customImageUrl.trim()) return;
    setFormImages((prev) => [...prev, customImageUrl.trim()]);
    setCustomImageUrl('');
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = formName.trim() || 'HOOR FAB Signature Ensemble';
    const parsedPrice = Math.max(1, Number(formPrice) || 1999);
    const parsedSalePrice =
      formSalePrice.trim() !== '' && Number(formSalePrice) > 0
        ? Number(formSalePrice)
        : null;

    let finalImages = [...formImages];
    if (finalImages.length === 0) {
      const styleMap: Record<
        string,
        | 'pakistani-suit'
        | 'coord-set'
        | 'daily-kurti'
        | 'party-sharara'
        | 'bridal-lehenga'
      > = {
        'Pakistani Suits': 'pakistani-suit',
        'Coord Sets': 'coord-set',
        'Daily Wear': 'daily-kurti',
        'Party Wear': 'party-sharara',
        'Bridal Wear': 'bridal-lehenga',
      };
      finalImages = [
        createFashionLookbookSvg({
          bgPrimary: '#161412',
          bgSecondary: '#0B0A09',
          garmentPrimary: '#2A3F36',
          garmentSecondary: '#1B2923',
          dupattaColor: '#C9A96E',
          accentGold: '#C9A96E',
          garmentStyle: styleMap[formCategory] || 'pakistani-suit',
          title: cleanName.slice(0, 22),
          subtitle: formCategory,
        }),
      ];
    }

    const payload = {
      name: cleanName,
      category: formCategory,
      price: parsedPrice,
      salePrice: parsedSalePrice,
      description: formDescription.trim(),
      fabric: formFabric.trim(),
      color: formColor.trim() || 'Signature Shade',
      sizes: formSizes.length > 0 ? formSizes : ['Standard'],
      images: finalImages,
      available: formAvailable,
      featured: formFeatured,
      newArrival: formNewArrival,
      active: formActive,
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, payload);
    } else {
      addProduct(payload);
    }

    setIsProductModalOpen(false);
  };

  const toggleSizeInForm = (size: string) => {
    setFormSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const handleCollectionImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const dataUrl = await processUploadedImageFile(file, 900, 0.85);
    setColImage(dataUrl);
  };

  const handleSaveCollection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!colName.trim()) return;
    const finalImg =
      colImage ||
      createFashionLookbookSvg({
        bgPrimary: '#171513',
        bgSecondary: '#0A0908',
        garmentPrimary: '#3A2E25',
        garmentSecondary: '#261E18',
        dupattaColor: '#C9A96E',
        accentGold: '#C9A96E',
        garmentStyle: 'pakistani-suit',
        title: colName.trim(),
        subtitle: colSubtitle.trim() || 'HOOR FAB Collection',
      });

    if (editingCollection) {
      updateCollection(editingCollection.id, {
        name: colName.trim(),
        subtitle: colSubtitle.trim(),
        image: finalImg,
      });
    } else {
      addCollection({
        name: colName.trim(),
        subtitle: colSubtitle.trim() || 'Explore our curated styles',
        image: finalImg,
      });
    }
    setEditingCollection(null);
    setColName('');
    setColSubtitle('');
    setColImage('');
  };

  const handleLogoUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'icon' | 'full'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const dataUrl = await processUploadedImageFile(file, 800, 0.92);
    if (type === 'icon') {
      updateSettings({ logoIconUrl: dataUrl });
    } else {
      updateSettings({ logoFullUrl: dataUrl });
    }
    setSettingsSavedMsg('Brand logo updated and applied across the storefront.');
    setTimeout(() => setSettingsSavedMsg(''), 3000);
  };

  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-[#0B0B0C] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-2xl bg-[#131316] border border-[#C9A96E]/35 p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex items-center justify-between">
            <img
              src={settings.logoIconUrl || '/logo-h-icon.svg'}
              alt="HOOR FAB H Icon"
              className="w-12 h-12 object-contain"
            />
            <button
              type="button"
              onClick={onBackToStore}
              className="inline-flex items-center gap-1.5 text-xs text-[#F7F3EB]/70 hover:text-[#C9A96E]"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Storefront</span>
            </button>
          </div>

          <div>
            <div className="text-[11px] uppercase tracking-[0.22em] text-[#C9A96E] font-medium">
              Admin Portal
            </div>
            <h1 className="font-serif-display text-2xl sm:text-3xl font-semibold text-[#F7F3EB] mt-1">
              HOOR FAB Admin Login
            </h1>
            <p className="text-xs text-[#F7F3EB]/65 mt-1">
              Sign in with your administrator credentials to manage products,
              collections, inventory, and store settings.
            </p>
          </div>

          {loginError && (
            <div className="p-3 rounded-lg bg-red-950/60 border border-red-500/40 text-xs text-red-200">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#F7F3EB]/80 mb-1.5">
                Admin Email
              </label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="admin@hoorfab.com"
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#0B0B0C] border border-white/15 text-sm text-[#F7F3EB] focus:outline-none focus:border-[#C9A96E]"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#F7F3EB]/80 mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#0B0B0C] border border-white/15 text-sm text-[#F7F3EB] focus:outline-none focus:border-[#C9A96E]"
              />
            </div>

            <button
              type="submit"
              className="w-full min-h-[46px] py-3 px-4 rounded-lg bg-[#C9A96E] hover:bg-[#d8b97e] text-[#0B0B0C] font-semibold text-xs uppercase tracking-wider transition-colors"
            >
              Sign In to Admin Dashboard
            </button>
          </form>

          <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-2 text-xs text-[#F7F3EB]/60">
            <span>Default: admin@hoorfab.com</span>
            <button
              type="button"
              onClick={() => {
                setLoginEmail('admin@hoorfab.com');
                setLoginPassword('HoorFab@2026');
                setLoginError('');
              }}
              className="inline-flex items-center gap-1 text-[#C9A96E] hover:underline font-medium"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Fill Demo Credentials</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0B0C] text-[#F7F3EB] pb-20">
      <div className="bg-[#121215] border-b border-[#C9A96E]/25 px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-[1360px] mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src={settings.logoIconUrl || '/logo-h-icon.svg'}
              alt="HOOR FAB Admin"
              className="w-10 h-10 object-contain"
            />
            <div>
              <h1 className="font-serif-display text-xl sm:text-2xl font-semibold text-[#F7F3EB]">
                HOOR FAB Admin Dashboard
              </h1>
              <p className="text-xs text-[#F7F3EB]/60">
                {isFirebaseConfigured()
                  ? 'Connected to Firebase Cloud Backend'
                  : 'Active Persistent Store Database · Realtime Sync'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onBackToStore}
              className="px-3.5 py-2 rounded-lg border border-white/15 hover:border-[#C9A96E] text-xs font-medium text-[#F7F3EB] flex items-center gap-1.5 transition-colors whitespace-nowrap"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>View Storefront</span>
            </button>

            <button
              type="button"
              onClick={logoutAdmin}
              className="px-3.5 py-2 rounded-lg bg-white/5 hover:bg-red-950/60 border border-white/10 hover:border-red-500/40 text-xs font-medium text-[#F7F3EB] flex items-center gap-1.5 transition-colors whitespace-nowrap"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* KPI Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-xl bg-[#141417] border border-white/10">
            <span className="text-xs uppercase tracking-wider text-[#F7F3EB]/60">
              Total Products
            </span>
            <p className="font-tabular text-3xl font-bold text-[#F7F3EB] mt-1">
              {stats.total}
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[#141417] border border-white/10">
            <span className="text-xs uppercase tracking-wider text-[#C9A96E]">
              Featured Products
            </span>
            <p className="font-tabular text-3xl font-bold text-[#C9A96E] mt-1">
              {stats.featured}
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[#141417] border border-white/10">
            <span className="text-xs uppercase tracking-wider text-emerald-400">
              Available Products
            </span>
            <p className="font-tabular text-3xl font-bold text-emerald-400 mt-1">
              {stats.available}
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[#141417] border border-white/10">
            <span className="text-xs uppercase tracking-wider text-amber-400">
              Out of Stock
            </span>
            <p className="font-tabular text-3xl font-bold text-amber-400 mt-1">
              {stats.outOfStock}
            </p>
          </div>
        </div>

        {/* Action / Tab Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={openCreateProductModal}
              className="px-4 py-2.5 rounded-lg bg-[#C9A96E] hover:bg-[#d8b97e] text-[#0B0B0C] font-semibold text-xs uppercase tracking-wider flex items-center gap-2 transition-colors whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add Product</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('products')}
              className={`px-4 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-colors whitespace-nowrap ${
                activeTab === 'products'
                  ? 'bg-white/15 text-[#F7F3EB] border border-[#C9A96E]'
                  : 'bg-[#141417] text-[#F7F3EB]/70 hover:text-[#F7F3EB] border border-white/10'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Manage Products ({products.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('collections')}
              className={`px-4 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-colors whitespace-nowrap ${
                activeTab === 'collections'
                  ? 'bg-white/15 text-[#F7F3EB] border border-[#C9A96E]'
                  : 'bg-[#141417] text-[#F7F3EB]/70 hover:text-[#F7F3EB] border border-white/10'
              }`}
            >
              <FolderKanban className="w-4 h-4" />
              <span>Manage Collections ({collections.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('photos')}
              className={`px-4 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-colors whitespace-nowrap ${
                activeTab === 'photos'
                  ? 'bg-[#C9A96E] text-[#0B0B0C] font-bold shadow'
                  : 'bg-[#141417] text-[#C9A96E] hover:text-[#F7F3EB] border border-[#C9A96E]/40'
              }`}
            >
              <Camera className="w-4 h-4" />
              <span>📸 6 Photos Manager (Admin Upload)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('settings')}
              className={`px-4 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-colors whitespace-nowrap ${
                activeTab === 'settings'
                  ? 'bg-white/15 text-[#F7F3EB] border border-[#C9A96E]'
                  : 'bg-[#141417] text-[#F7F3EB]/70 hover:text-[#F7F3EB] border border-white/10'
              }`}
            >
              <SettingsIcon className="w-4 h-4" />
              <span>Settings</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Products */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-[#141417] p-4 rounded-xl border border-white/10">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-[#C9A96E] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={adminSearch}
                  onChange={(e) => setAdminSearch(e.target.value)}
                  placeholder="Search products by name, category, or color..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-[#0B0B0C] border border-white/15 text-sm text-[#F7F3EB] focus:outline-none focus:border-[#C9A96E]"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                {[
                  'All',
                  'Pakistani Suits',
                  'Coord Sets',
                  'Daily Wear',
                  'Party Wear',
                  'Bridal Wear',
                ].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setAdminCategory(cat)}
                    className={`px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                      adminCategory === cat
                        ? 'bg-[#C9A96E] text-[#0B0B0C] font-semibold'
                        : 'bg-[#0B0B0C] text-[#F7F3EB]/75 hover:text-[#F7F3EB]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block rounded-xl overflow-hidden border border-white/10 bg-[#141417]">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 bg-[#0E0E11] text-[11px] uppercase tracking-wider text-[#C9A96E]">
                    <th className="py-3.5 px-4">Image</th>
                    <th className="py-3.5 px-4">Product Name</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Price</th>
                    <th className="py-3.5 px-4">Stock</th>
                    <th className="py-3.5 px-4">Featured</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10 text-sm">
                  {filteredAdminProducts.map((prod) => {
                    const effective = getEffectivePrice(prod);
                    return (
                      <tr
                        key={prod.id}
                        className={`hover:bg-white/[0.02] transition-colors ${
                          !prod.active ? 'opacity-55' : ''
                        }`}
                      >
                        <td className="py-3 px-4">
                          <div className="w-12 h-16 rounded-lg overflow-hidden bg-[#0B0B0C] border border-white/10">
                            <FashionImage
                              src={prod.images[0]}
                              alt={prod.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-serif-display font-semibold text-[#F7F3EB]">
                            {prod.name}
                          </div>
                          <div className="text-xs text-[#F7F3EB]/55 mt-0.5">
                            Sizes: {prod.sizes.join(', ')} · {prod.color}
                            {prod.newArrival ? ' · New Arrival' : ''}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-xs text-[#F7F3EB]/80">
                          {prod.category}
                        </td>
                        <td className="py-3 px-4 font-tabular">
                          <div className="font-semibold text-[#F7F3EB]">
                            ₹{effective.toLocaleString('en-IN')}
                          </div>
                          {prod.salePrice && prod.salePrice < prod.price && (
                            <div className="text-xs text-[#F7F3EB]/45 line-through">
                              ₹{prod.price.toLocaleString('en-IN')}
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <button
                            type="button"
                            onClick={() =>
                              updateProduct(prod.id, {
                                available: !prod.available,
                              })
                            }
                            className={`text-xs font-medium underline-offset-4 hover:underline ${
                              prod.available
                                ? 'text-emerald-400'
                                : 'text-amber-400'
                            }`}
                          >
                            {prod.available ? 'In Stock' : 'Out of Stock'}
                          </button>
                        </td>
                        <td className="py-3 px-4">
                          <button
                            type="button"
                            onClick={() =>
                              updateProduct(prod.id, {
                                featured: !prod.featured,
                              })
                            }
                            className={`inline-flex items-center gap-1 text-xs font-medium ${
                              prod.featured
                                ? 'text-[#C9A96E]'
                                : 'text-[#F7F3EB]/40 hover:text-[#F7F3EB]'
                            }`}
                          >
                            <Star
                              className={`w-4 h-4 ${
                                prod.featured ? 'fill-current' : ''
                              }`}
                            />
                            <span>{prod.featured ? 'Featured' : 'Standard'}</span>
                          </button>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="inline-flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => openEditProductModal(prod)}
                              className="px-2.5 py-1.5 rounded-md bg-white/10 hover:bg-[#C9A96E] text-[#F7F3EB] hover:text-[#0B0B0C] text-xs font-medium inline-flex items-center gap-1 transition-colors"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>Edit</span>
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                updateProduct(prod.id, { active: !prod.active })
                              }
                              title={
                                prod.active
                                  ? 'Deactivate Product'
                                  : 'Activate Product'
                              }
                              className="px-2.5 py-1.5 rounded-md bg-white/5 hover:bg-white/15 text-xs font-medium inline-flex items-center gap-1 transition-colors"
                            >
                              {prod.active ? (
                                <>
                                  <Eye className="w-3.5 h-3.5 text-emerald-400" />
                                  <span>Active</span>
                                </>
                              ) : (
                                <>
                                  <EyeOff className="w-3.5 h-3.5 text-amber-400" />
                                  <span>Hidden</span>
                                </>
                              )}
                            </button>

                            {deleteConfirmId === prod.id ? (
                              <button
                                type="button"
                                onClick={() => {
                                  deleteProduct(prod.id);
                                  setDeleteConfirmId(null);
                                }}
                                className="px-2.5 py-1.5 rounded-md bg-red-600 text-white text-xs font-semibold"
                              >
                                Confirm
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setDeleteConfirmId(prod.id)}
                                className="p-1.5 rounded-md text-[#F7F3EB]/55 hover:text-red-400 hover:bg-red-950/40 transition-colors"
                                aria-label={`Delete ${prod.name}`}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden grid grid-cols-1 gap-4">
              {filteredAdminProducts.map((prod) => {
                const effective = getEffectivePrice(prod);
                return (
                  <div
                    key={prod.id}
                    className={`p-4 rounded-xl bg-[#141417] border border-white/10 space-y-3 ${
                      !prod.active ? 'opacity-60' : ''
                    }`}
                  >
                    <div className="flex gap-3.5">
                      <div className="w-20 h-24 rounded-lg overflow-hidden bg-[#0B0B0C] shrink-0">
                        <FashionImage
                          src={prod.images[0]}
                          alt={prod.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[11px] uppercase tracking-wider text-[#C9A96E]">
                          {prod.category}
                        </div>
                        <h3 className="font-serif-display text-base font-semibold text-[#F7F3EB] truncate">
                          {prod.name}
                        </h3>
                        <div className="font-tabular text-sm font-bold text-[#F7F3EB] mt-1">
                          ₹{effective.toLocaleString('en-IN')}
                          {prod.salePrice && prod.salePrice < prod.price && (
                            <span className="ml-2 text-xs text-[#F7F3EB]/45 line-through">
                              ₹{prod.price.toLocaleString('en-IN')}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-[#F7F3EB]/60 mt-1">
                          {prod.available ? 'In Stock' : 'Out of Stock'} ·{' '}
                          {prod.featured ? 'Featured' : 'Standard'} ·{' '}
                          {prod.active ? 'Active' : 'Inactive'}
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => openEditProductModal(prod)}
                        className="flex-1 py-2 px-3 rounded-lg bg-[#C9A96E] text-[#0B0B0C] text-xs font-semibold flex items-center justify-center gap-1.5"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          updateProduct(prod.id, { active: !prod.active })
                        }
                        className="py-2 px-3 rounded-lg bg-white/10 text-xs font-medium text-[#F7F3EB]"
                      >
                        {prod.active ? 'Deactivate' : 'Activate'}
                      </button>

                      <button
                        type="button"
                        onClick={() => deleteProduct(prod.id)}
                        className="py-2 px-3 rounded-lg bg-red-950/60 text-red-300 text-xs font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Collections */}
        {activeTab === 'collections' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Quick Banner: 6 Photos Manager */}
            <div className="lg:col-span-12 p-4 rounded-xl bg-gradient-to-r from-[#171512] via-[#1A1815] to-[#121110] border border-[#C9A96E]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#C9A96E]/15 border border-[#C9A96E]/30 flex items-center justify-center shrink-0">
                  <Camera className="w-5 h-5 text-[#C9A96E]" />
                </div>
                <div>
                  <h3 className="font-serif-display text-sm font-semibold text-[#F7F3EB]">
                    📸 6 Collection &amp; Banner Photos Manager (Admin Upload)
                  </h3>
                  <p className="text-xs text-[#F7F3EB]/70 mt-0.5">
                    Maria B suit, Pink Lehenga, Ethnic wear, Coord set, Daily wear &amp; Hero Banner photos ko yahan se upload ya replace karein.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('photos')}
                className="px-4 py-2.5 rounded-lg bg-[#C9A96E] hover:bg-[#d8b97e] text-[#0B0B0C] font-semibold text-xs uppercase tracking-wider shrink-0 transition-colors shadow"
              >
                Open 6 Photos Manager →
              </button>
            </div>

            <div className="lg:col-span-5 p-6 rounded-xl bg-[#141417] border border-white/10 space-y-4 h-fit">
              <h2 className="font-serif-display text-xl font-semibold text-[#F7F3EB]">
                {editingCollection ? 'Edit Collection' : 'Add New Collection'}
              </h2>
              <form onSubmit={handleSaveCollection} className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#F7F3EB]/75 mb-1">
                    Collection Name
                  </label>
                  <input
                    type="text"
                    required
                    value={colName}
                    onChange={(e) => setColName(e.target.value)}
                    placeholder="e.g. Festive Velvet Edit"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#0B0B0C] border border-white/15 text-sm text-[#F7F3EB]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#F7F3EB]/75 mb-1">
                    Subtitle
                  </label>
                  <input
                    type="text"
                    value={colSubtitle}
                    onChange={(e) => setColSubtitle(e.target.value)}
                    placeholder="Short description shown on collection card"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#0B0B0C] border border-white/15 text-sm text-[#F7F3EB]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#F7F3EB]/75 mb-1">
                    Collection Cover Image
                  </label>
                  <label className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-lg border border-dashed border-[#C9A96E]/50 bg-[#0B0B0C] hover:bg-white/5 text-xs text-[#C9A96E] cursor-pointer">
                    <Upload className="w-4 h-4" />
                    <span>Upload Cover Image (Mobile / Desktop)</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCollectionImageUpload}
                      className="hidden"
                    />
                  </label>
                  {colImage && (
                    <div className="mt-2 w-24 h-32 rounded-lg overflow-hidden border border-[#C9A96E]/40">
                      <FashionImage
                        src={colImage}
                        alt="Collection preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 px-4 rounded-lg bg-[#C9A96E] text-[#0B0B0C] font-semibold text-xs uppercase tracking-wider"
                  >
                    {editingCollection ? 'Update Collection' : 'Save Collection'}
                  </button>
                  {editingCollection && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingCollection(null);
                        setColName('');
                        setColSubtitle('');
                        setColImage('');
                      }}
                      className="py-2.5 px-4 rounded-lg bg-white/10 text-xs"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {collections.map((col) => (
                <div
                  key={col.id}
                  className="p-4 rounded-xl bg-[#141417] border border-white/10 flex gap-4 items-center"
                >
                  <div className="w-16 h-20 rounded-lg overflow-hidden bg-[#0B0B0C] shrink-0">
                    <FashionImage
                      src={col.image}
                      alt={col.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-serif-display text-base font-semibold text-[#F7F3EB]">
                      {col.name}
                    </h3>
                    <p className="text-xs text-[#F7F3EB]/65 line-clamp-2 mt-0.5">
                      {col.subtitle}
                    </p>
                    <div className="mt-2.5 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingCollection(col);
                          setColName(col.name);
                          setColSubtitle(col.subtitle);
                          setColImage(col.image);
                        }}
                        className="text-xs text-[#C9A96E] hover:underline font-medium"
                      >
                        Edit
                      </button>
                      {collections.length > 1 && (
                        <>
                          <span className="text-white/20">·</span>
                          <button
                            type="button"
                            onClick={() => deleteCollection(col.id)}
                            className="text-xs text-red-400 hover:underline"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab: 6 Photos Manager (Admin Upload Only) */}
        {activeTab === 'photos' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-gradient-to-r from-[#171512] via-[#151318] to-[#121110] border border-[#C9A96E]/35 shadow-xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[#C9A96E]" />
                    <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#C9A96E]">
                      Admin Only Photo Portal
                    </span>
                  </div>
                  <h2 className="font-serif-display text-2xl font-semibold text-[#F7F3EB] mt-1">
                    6 Storefront Fashion Photos Manager
                  </h2>
                  <p className="text-xs sm:text-sm text-[#F7F3EB]/75 max-w-3xl mt-1 leading-relaxed">
                    Yahan se aap apne 6 main fashion photos (Maria B suit, Pink Lehenga, Ethnic Wear, Coord Set, Daily Wear aur Hero Banner) upload kar sakte hain. Public website par normal visitors ya users upload nahi kar sakte — ye control sirf aapke Admin Panel mein hai.
                  </p>
                </div>

                <div className="flex items-center gap-2.5 flex-wrap shrink-0">
                  <label className="min-h-[44px] px-5 py-2.5 rounded-lg bg-[#C9A96E] hover:bg-[#d8b97e] text-[#0B0B0C] font-semibold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all shadow-md active:scale-95 whitespace-nowrap">
                    <Upload className="w-4 h-4" />
                    <span>{isUploadingPhoto ? 'Uploading...' : 'Upload All 6 Photos Together'}</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleBatch6PhotosUpload}
                      className="hidden"
                    />
                  </label>

                  <button
                    type="button"
                    onClick={handleResetAllSlots}
                    className="min-h-[44px] px-4 py-2.5 rounded-lg border border-white/15 hover:border-[#C9A96E] bg-white/5 text-xs text-[#F7F3EB]/80 hover:text-[#F7F3EB] flex items-center gap-1.5 transition-colors whitespace-nowrap"
                    title="Reset all 6 to default studio artworks"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Reset All to Studio Artworks</span>
                  </button>
                </div>
              </div>

              {photoUploadStatus && (
                <div className="mt-4 p-3.5 rounded-lg bg-emerald-950/70 border border-emerald-500/40 text-xs text-emerald-200 flex items-center gap-2">
                  <Check className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>{photoUploadStatus}</span>
                </div>
              )}
            </div>

            {/* 6 Photo Slots Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  id: 'col-pakistani-suits',
                  title: '1. Maria B Pakistani Suit',
                  subtitle: 'Pakistani Suits (Card 1 in Storefront Collection)',
                  currentImage:
                    collections.find((c) => c.id === 'col-pakistani-suits')?.image ||
                    '/images/collection-maria-b-suit.svg',
                  userFileHint: 'maria B elegent dress.jpg / download (20).jpg',
                },
                {
                  id: 'col-coord-sets',
                  title: '2. Modern Coord Set',
                  subtitle: 'Coord Sets (Card 2 in Storefront Collection)',
                  currentImage:
                    collections.find((c) => c.id === 'col-coord-sets')?.image ||
                    '/images/collection-coord-set.svg',
                  userFileHint: 'download (19).jpg / Modern Silk Coord',
                },
                {
                  id: 'col-daily-wear',
                  title: '3. Daily Wear Mulmul Kurta',
                  subtitle: 'Daily Wear (Card 3 in Storefront Collection)',
                  currentImage:
                    collections.find((c) => c.id === 'col-daily-wear')?.image ||
                    '/images/collection-daily-wear.svg',
                  userFileHint: 'download (7).jpg / Breathable Mulmul Cotton',
                },
                {
                  id: 'col-party-wear',
                  title: '4. Festive Ethnic Wear / Sharara',
                  subtitle: 'Party Wear (Card 4 in Storefront Collection)',
                  currentImage:
                    collections.find((c) => c.id === 'col-party-wear')?.image ||
                    '/images/collection-ethnic-wear.svg',
                  userFileHint: 'Ethnic wear.jpg / Festive Anarkali Sharara',
                },
                {
                  id: 'col-bridal-wear',
                  title: '5. Pink Full Woman Lehenga',
                  subtitle: 'Bridal Wear (Card 5 in Storefront Collection)',
                  currentImage:
                    collections.find((c) => c.id === 'col-bridal-wear')?.image ||
                    '/images/collection-pink-lehenga.svg',
                  userFileHint: 'pink colour full woman lahanga.jpg',
                },
                {
                  id: 'hero-banner',
                  title: '6. Hero Main Storefront Banner',
                  subtitle: 'Home Page Hero Top Display Banner',
                  currentImage: settings.heroImageUrl || HERO_BANNER_IMAGE,
                  userFileHint: 'download (20).jpg / Main Showcase Banner',
                },
              ].map((slot) => {
                const isCustomUploaded = slot.currentImage.startsWith('data:image/');
                return (
                  <div
                    key={slot.id}
                    className="rounded-2xl bg-[#141417] border border-white/10 overflow-hidden flex flex-col justify-between p-5 space-y-4 shadow-lg hover:border-[#C9A96E]/50 transition-colors"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs uppercase tracking-wider text-[#C9A96E] font-semibold">
                          {slot.title}
                        </span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                            isCustomUploaded
                              ? 'bg-emerald-950 border border-emerald-500/40 text-emerald-300'
                              : 'bg-white/5 border border-white/10 text-[#F7F3EB]/60'
                          }`}
                        >
                          {isCustomUploaded ? 'Custom Photo' : 'Studio Artwork'}
                        </span>
                      </div>

                      <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-[#0B0B0C] border border-white/10">
                        <FashionImage
                          src={slot.currentImage}
                          alt={slot.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div>
                        <p className="text-xs text-[#F7F3EB]/70 font-medium">
                          {slot.subtitle}
                        </p>
                        <p className="text-[11px] text-[#C9A96E]/80 mt-0.5 font-mono truncate">
                          Target file: {slot.userFileHint}
                        </p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-white/10 flex items-center gap-2">
                      <label className="flex-1 py-2.5 px-3 rounded-lg bg-[#C9A96E] hover:bg-[#d8b97e] text-[#0B0B0C] font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer transition-colors shadow">
                        <Camera className="w-3.5 h-3.5" />
                        <span>Upload Photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleSlotImageUpload(slot.id, file);
                            e.target.value = '';
                          }}
                          className="hidden"
                        />
                      </label>

                      <button
                        type="button"
                        onClick={() => handleResetSlotToDefault(slot.id)}
                        className="py-2.5 px-3 rounded-lg border border-white/10 hover:border-white/20 bg-white/5 text-xs text-[#F7F3EB]/70 hover:text-[#F7F3EB] flex items-center justify-center gap-1 transition-colors"
                        title="Restore original studio artwork"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Reset</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 3: Settings */}
        {activeTab === 'settings' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-6 p-6 rounded-xl bg-[#141417] border border-white/10 space-y-5">
              <div>
                <h2 className="font-serif-display text-xl font-semibold text-[#F7F3EB]">
                  Brand Logos &amp; Store Identity
                </h2>
                <p className="text-xs text-[#F7F3EB]/65 mt-1">
                  Upload your HOOR FAB H icon logo (used on mobile header &amp;
                  favicon) and complete HOOR FAB logo (used on desktop header &amp;
                  footer).
                </p>
              </div>

              {settingsSavedMsg && (
                <div className="p-3 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-xs text-emerald-200 flex items-center gap-2">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>{settingsSavedMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#0B0B0C] border border-white/10 space-y-3">
                  <span className="text-xs uppercase tracking-wider text-[#C9A96E] block font-semibold">
                    1. H Icon Logo (Mobile &amp; Favicon)
                  </span>
                  <div className="h-20 flex items-center justify-center bg-[#141417] rounded-lg p-2">
                    <img
                      src={settings.logoIconUrl || '/logo-h-icon.svg'}
                      alt="H Icon Logo Preview"
                      className="h-14 w-14 object-contain"
                    />
                  </div>
                  <label className="w-full py-2 px-3 rounded-lg bg-white/10 hover:bg-[#C9A96E] text-[#F7F3EB] hover:text-[#0B0B0C] text-xs font-medium flex items-center justify-center gap-1.5 cursor-pointer transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload H Icon Logo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleLogoUpload(e, 'icon')}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="p-4 rounded-xl bg-[#0B0B0C] border border-white/10 space-y-3">
                  <span className="text-xs uppercase tracking-wider text-[#C9A96E] block font-semibold">
                    2. Complete HOOR FAB Logo
                  </span>
                  <div className="h-20 flex items-center justify-center bg-[#141417] rounded-lg p-2">
                    <img
                      src={settings.logoFullUrl || '/logo-full.svg'}
                      alt="Full Logo Preview"
                      className="h-12 w-auto object-contain"
                    />
                  </div>
                  <label className="w-full py-2 px-3 rounded-lg bg-white/10 hover:bg-[#C9A96E] text-[#F7F3EB] hover:text-[#0B0B0C] text-xs font-medium flex items-center justify-center gap-1.5 cursor-pointer transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Complete Logo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleLogoUpload(e, 'full')}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="pt-2 space-y-3">
                <label className="block text-xs uppercase tracking-wider text-[#F7F3EB]/75">
                  Store WhatsApp Number
                </label>
                <input
                  type="text"
                  value={settings.whatsappNumber}
                  onChange={(e) =>
                    updateSettings({
                      whatsappNumber: e.target.value,
                      whatsappDisplay: `+${e.target.value.replace(/\D/g, '')}`,
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#0B0B0C] border border-white/15 text-sm font-tabular text-[#F7F3EB]"
                />
              </div>
            </div>

            <div className="lg:col-span-6 space-y-6">
              <div className="p-6 rounded-xl bg-[#141417] border border-white/10 space-y-4">
                <h2 className="font-serif-display text-xl font-semibold text-[#F7F3EB]">
                  Admin Credentials &amp; Reset
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#F7F3EB]/75 mb-1">
                      Admin Email
                    </label>
                    <input
                      type="email"
                      value={newAdminEmail}
                      onChange={(e) => setNewAdminEmail(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-[#0B0B0C] border border-white/15 text-sm text-[#F7F3EB]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#F7F3EB]/75 mb-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={newAdminPass}
                      onChange={(e) => setNewAdminPass(e.target.value)}
                      placeholder="Enter new password"
                      className="w-full px-3 py-2 rounded-lg bg-[#0B0B0C] border border-white/15 text-sm text-[#F7F3EB]"
                    />
                  </div>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      if (newAdminEmail && newAdminPass) {
                        updateAdminPassword(newAdminEmail, newAdminPass);
                        setNewAdminPass('');
                        setSettingsSavedMsg('Admin credentials updated.');
                        setTimeout(() => setSettingsSavedMsg(''), 3000);
                      }
                    }}
                    className="px-4 py-2 rounded-lg bg-[#C9A96E] text-[#0B0B0C] text-xs font-semibold uppercase tracking-wider"
                  >
                    Update Admin Login
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      resetCatalogToDefaults();
                      setSettingsSavedMsg(
                        'Store catalog restored to initial defaults.'
                      );
                      setTimeout(() => setSettingsSavedMsg(''), 3000);
                    }}
                    className="px-4 py-2 rounded-lg border border-white/15 hover:border-red-400 text-xs text-[#F7F3EB]/75 hover:text-red-300 inline-flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Restore Default Catalog</span>
                  </button>
                </div>
              </div>

              <div className="p-6 rounded-xl bg-[#141417] border border-[#C9A96E]/30 space-y-2.5 text-xs text-[#F7F3EB]/75 leading-relaxed">
                <div className="text-[#C9A96E] font-semibold uppercase tracking-wider">
                  Firebase Cloud Backend Ready
                </div>
                <p>
                  To sync with external Firebase Firestore &amp; Storage, add
                  credentials to{' '}
                  <code className="text-[#F7F3EB] bg-black/50 px-1.5 py-0.5 rounded">
                    src/services/firebaseConfig.ts
                  </code>
                  . Current products and uploaded images persist automatically
                  in your browser database.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add / Edit Product Modal */}
      {isProductModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto"
          onClick={() => setIsProductModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#141417] border border-[#C9A96E]/40 p-5 sm:p-7 text-[#F7F3EB] shadow-2xl space-y-5"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h2 className="font-serif-display text-2xl font-semibold">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button
                type="button"
                onClick={() => setIsProductModalOpen(false)}
                className="p-1.5 rounded-lg text-[#F7F3EB]/70 hover:text-[#F7F3EB]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                <div className="sm:col-span-7">
                  <label className="block text-xs uppercase tracking-wider text-[#F7F3EB]/80 mb-1">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Ayesha Emerald Chiffon Pakistani Suit"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#0B0B0C] border border-white/15 text-sm text-[#F7F3EB] focus:border-[#C9A96E] focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-5">
                  <label className="block text-xs uppercase tracking-wider text-[#F7F3EB]/80 mb-1">
                    Category *
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#0B0B0C] border border-white/15 text-sm text-[#F7F3EB] focus:border-[#C9A96E] focus:outline-none"
                  >
                    {[
                      'Pakistani Suits',
                      'Coord Sets',
                      'Daily Wear',
                      'Party Wear',
                      'Bridal Wear',
                      ...collections
                        .map((c) => c.name)
                        .filter(
                          (n) =>
                            ![
                              'Pakistani Suits',
                              'Coord Sets',
                              'Daily Wear',
                              'Party Wear',
                              'Bridal Wear',
                            ].includes(n)
                        ),
                    ].map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#F7F3EB]/80 mb-1">
                    Regular Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#0B0B0C] border border-white/15 text-sm font-tabular text-[#F7F3EB]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#C9A96E] mb-1">
                    Sale Price (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formSalePrice}
                    onChange={(e) => setFormSalePrice(e.target.value)}
                    placeholder="Optional"
                    className="w-full px-3 py-2 rounded-lg bg-[#0B0B0C] border border-white/15 text-sm font-tabular text-[#F7F3EB]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#F7F3EB]/80 mb-1">
                    Color
                  </label>
                  <input
                    type="text"
                    value={formColor}
                    onChange={(e) => setFormColor(e.target.value)}
                    placeholder="e.g. Ivory & Gold"
                    className="w-full px-3 py-2 rounded-lg bg-[#0B0B0C] border border-white/15 text-sm text-[#F7F3EB]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#F7F3EB]/80 mb-1">
                    Fabric
                  </label>
                  <input
                    type="text"
                    value={formFabric}
                    onChange={(e) => setFormFabric(e.target.value)}
                    placeholder="e.g. Pure Organza"
                    className="w-full px-3 py-2 rounded-lg bg-[#0B0B0C] border border-white/15 text-sm text-[#F7F3EB]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#F7F3EB]/80 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Describe embroidery, fabric feel, and included pieces..."
                  className="w-full px-3.5 py-2 rounded-lg bg-[#0B0B0C] border border-white/15 text-sm text-[#F7F3EB]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#F7F3EB]/80 mb-1.5">
                  Available Sizes
                </label>
                <div className="flex flex-wrap gap-2">
                  {ALL_SIZES.map((sz) => {
                    const active = formSizes.includes(sz);
                    return (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => toggleSizeInForm(sz)}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                          active
                            ? 'bg-[#C9A96E] text-[#0B0B0C]'
                            : 'bg-[#0B0B0C] border border-white/15 text-[#F7F3EB]/65'
                        }`}
                      >
                        {sz}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-2.5">
                <label className="block text-xs uppercase tracking-wider text-[#F7F3EB]/80">
                  Product Images ({formImages.length})
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <label className="py-3 px-4 rounded-xl border border-dashed border-[#C9A96E]/60 bg-[#0B0B0C] hover:bg-white/5 text-xs font-medium text-[#C9A96E] flex items-center justify-center gap-2 cursor-pointer transition-colors">
                    <ImagePlus className="w-4 h-4" />
                    <span>
                      {uploadingImage
                        ? 'Processing Image...'
                        : 'Upload from Device / Camera'}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleProductImageFiles}
                      className="hidden"
                    />
                  </label>

                  <button
                    type="button"
                    onClick={() => {
                      const generated = createFashionLookbookSvg({
                        bgPrimary: '#171412',
                        bgSecondary: '#0A0908',
                        garmentPrimary: '#2E4036',
                        garmentSecondary: '#1C2922',
                        dupattaColor: '#C9A96E',
                        accentGold: '#C9A96E',
                        garmentStyle: 'pakistani-suit',
                        title: formName || 'HOOR FAB Couture',
                        subtitle: formCategory,
                      });
                      setFormImages((prev) => [...prev, generated]);
                    }}
                    className="py-3 px-4 rounded-xl border border-white/15 bg-[#0B0B0C] hover:border-[#C9A96E] text-xs font-medium text-[#F7F3EB] flex items-center justify-center gap-2 transition-colors"
                  >
                    <Sparkles className="w-4 h-4 text-[#C9A96E]" />
                    <span>Generate Lookbook Plate</span>
                  </button>
                </div>

                <div className="flex gap-2">
                  <input
                    type="url"
                    value={customImageUrl}
                    onChange={(e) => setCustomImageUrl(e.target.value)}
                    placeholder="Or paste an image URL..."
                    className="flex-1 px-3 py-2 rounded-lg bg-[#0B0B0C] border border-white/15 text-xs text-[#F7F3EB]"
                  />
                  <button
                    type="button"
                    onClick={handleAddImageUrl}
                    className="px-3.5 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium"
                  >
                    Add URL
                  </button>
                </div>

                {formImages.length > 0 && (
                  <div className="flex items-center gap-3 overflow-x-auto pt-2 pb-1">
                    {formImages.map((img, i) => (
                      <div
                        key={i}
                        className="relative w-20 h-24 rounded-lg overflow-hidden border border-[#C9A96E]/40 shrink-0 group"
                      >
                        <FashionImage
                          src={img}
                          alt={`Upload preview ${i + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setFormImages((prev) =>
                              prev.filter((_, idx) => idx !== i)
                            )
                          }
                          className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/80 text-white flex items-center justify-center"
                          aria-label="Remove image"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
                {[
                  {
                    label: 'In Stock',
                    checked: formAvailable,
                    setChecked: setFormAvailable,
                  },
                  {
                    label: 'Featured',
                    checked: formFeatured,
                    setChecked: setFormFeatured,
                  },
                  {
                    label: 'New Arrival',
                    checked: formNewArrival,
                    setChecked: setFormNewArrival,
                  },
                  {
                    label: 'Active on Site',
                    checked: formActive,
                    setChecked: setFormActive,
                  },
                ].map((toggle) => (
                  <label
                    key={toggle.label}
                    className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer text-xs font-medium transition-colors ${
                      toggle.checked
                        ? 'bg-[#C9A96E]/15 border-[#C9A96E] text-[#F7F3EB]'
                        : 'bg-[#0B0B0C] border-white/10 text-[#F7F3EB]/55'
                    }`}
                  >
                    <span>{toggle.label}</span>
                    <input
                      type="checkbox"
                      checked={toggle.checked}
                      onChange={(e) => toggle.setChecked(e.target.checked)}
                      className="accent-[#C9A96E] w-4 h-4"
                    />
                  </label>
                ))}
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-5 py-2.5 rounded-lg bg-white/10 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-lg bg-[#C9A96E] hover:bg-[#d8b97e] text-[#0B0B0C] font-semibold text-xs uppercase tracking-wider"
                >
                  {editingProduct ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
