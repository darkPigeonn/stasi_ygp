const express = require('express');
const router = express.Router();
const createCRUDController = require('../controllers/crudController');
const lingkunganController = require('../controllers/lingkunganController');
const formulirController = require('../controllers/formulirController');
const { protect, authorize } = require('../middleware/auth');
const { upload } = require('../middleware/upload');
const models = require('../models');

// Helper function to create routes for a model
const createRoutes = (modelName, uploadFields = null) => {
  const Model = models[modelName];
  const controller = createCRUDController(Model, modelName);
  const routerInstance = express.Router();

  // Public routes
  routerInstance.get('/', controller.getAll);
  routerInstance.get('/:id', controller.getOne);
  if (Model.rawAttributes && Model.rawAttributes.slug) {
    routerInstance.get('/slug/:slug', controller.getBySlug);
  }

  // Protected routes (Admin/Editor)
  if (uploadFields) {
    routerInstance.post('/', protect, uploadFields, controller.create);
    routerInstance.put('/:id', protect, uploadFields, controller.update);
  } else {
    routerInstance.post('/', protect, controller.create);
    routerInstance.put('/:id', protect, controller.update);
  }
  routerInstance.delete('/:id', protect, authorize('admin'), controller.deleteOne);

  return routerInstance;
};

// Mount routes for each model
router.use('/artikel', createRoutes('Artikel', upload.array('images', 10)));
router.use('/pengumuman', createRoutes('Pengumuman', upload.array('images', 10)));
router.use('/galeri', createRoutes('Galeri', upload.array('images', 10)));
router.use('/dps', createRoutes('DPS', upload.single('photo')));
router.use('/pastor', createRoutes('Pastor', upload.single('photo')));
router.use('/wilayah', createRoutes('Wilayah', upload.single('mapImage')));

// Lingkungan routes with custom endpoint
const Lingkungan = models.Lingkungan;
const lingkunganCRUD = createCRUDController(Lingkungan, 'Lingkungan');
const lingkunganRouter = express.Router();

// Custom route MUST come BEFORE generic :id route
lingkunganRouter.get('/wilayah/:wilayahId', lingkunganController.getByWilayah);

// Generic CRUD routes
lingkunganRouter.get('/', lingkunganCRUD.getAll);
lingkunganRouter.get('/:id', lingkunganCRUD.getOne);
lingkunganRouter.post('/', protect, lingkunganCRUD.create);
lingkunganRouter.put('/:id', protect, lingkunganCRUD.update);
lingkunganRouter.delete('/:id', protect, authorize('admin'), lingkunganCRUD.deleteOne);

router.use('/lingkungan', lingkunganRouter);
router.use('/kategorial', createRoutes('Kategorial', upload.single('image')));
router.use('/kategori-formulir', createRoutes('KategoriFormulir'));

// Formulir routes with custom endpoints
const Formulir = models.Formulir;
const formulirCRUD = createCRUDController(Formulir, 'Formulir');
const formulirRouter = express.Router();

// Custom route for category filter
formulirRouter.get('/kategori/:kategoriFormulirId', formulirController.getByCategory);

// Generic CRUD routes - custom getAll with include
formulirRouter.get('/', formulirController.getAll);
formulirRouter.get('/:id', formulirCRUD.getOne);
formulirRouter.post('/', protect, upload.single('document'), formulirCRUD.create);
formulirRouter.put('/:id', protect, upload.single('document'), formulirCRUD.update);
formulirRouter.delete('/:id', protect, authorize('admin'), formulirCRUD.deleteOne);

router.use('/formulir', formulirRouter);
router.use('/sejarah', createRoutes('Sejarah'));

// Profile routes - allow update without auth (temporary for admin access)
const Profile = models.Profile;
const profileCRUD = createCRUDController(Profile, 'Profile');
const profileRouter = express.Router();

// Public routes
profileRouter.get('/', profileCRUD.getAll);
profileRouter.get('/:id', profileCRUD.getOne);

// Update route without auth (temporary - should add proper admin auth later)
profileRouter.put('/:id', upload.single('logo'), profileCRUD.update);

// Protected routes
profileRouter.post('/', protect, upload.single('logo'), profileCRUD.create);
profileRouter.delete('/:id', protect, authorize('admin'), profileCRUD.deleteOne);

router.use('/profile', profileRouter);
router.use('/karya-sosial', createRoutes('KaryaSosial', upload.single('image')));
router.use('/slider', createRoutes('Slider', upload.single('image')));
router.use('/intensi-misa', createRoutes('IntensiMisa', upload.fields([
  { name: 'qrCode', maxCount: 1 },
  { name: 'churchQRCode', maxCount: 1 },
  { name: 'socialQRCode', maxCount: 1 }
])));

// Jabatan routes with dedicated controller
const jabatanController = require('../controllers/jabatanController');
const jabatanRouter = express.Router();
jabatanRouter.get('/', jabatanController.getAll);
jabatanRouter.get('/:id', jabatanController.getById);
jabatanRouter.post('/', protect, jabatanController.create);
jabatanRouter.put('/:id', protect, jabatanController.update);
jabatanRouter.delete('/:id', protect, authorize('admin'), jabatanController.delete);
router.use('/jabatan', jabatanRouter);

// SubJabatan routes with dedicated controller
const subJabatanController = require('../controllers/subJabatanController');
const subJabatanRouter = express.Router();
subJabatanRouter.get('/', subJabatanController.getAll);
subJabatanRouter.get('/:id', subJabatanController.getById);
subJabatanRouter.post('/', protect, subJabatanController.create);
subJabatanRouter.put('/:id', protect, subJabatanController.update);
subJabatanRouter.delete('/:id', protect, authorize('admin'), subJabatanController.delete);
router.use('/sub-jabatan', subJabatanRouter);

module.exports = router;
