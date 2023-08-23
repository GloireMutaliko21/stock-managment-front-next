import getCategoriesReducer from '@/features/categories/getCategories';
import currentUserReducers from '@/features/currentUser/currentUser';
import modalReducer from '@/features/modal';
import myProductsReducers from '@/features/myProducts/getMyProducts';
import newProductsReducers from '@/features/newProducts/getNewProducts';
import productsReducers from '@/features/products/getProducts';
import getProvidersReducer from '@/features/products/getProviders';
import getAllSaleReducer from '@/features/sales/getAllSales';
import sidebarReducer from '@/features/sidebar';
import stepperReducer from '@/features/stepper';
import getUserReducers from '@/features/user/getUser';
import getDashboardReducer from '@/features/users/dashboard';
import getUsersReducers from '@/features/users/getUsers';
import getInventoryReducer from '@/features/users/inventory';
import getSupplierReducer from '@/features/suppliers/getSuppliers';
import { configureStore } from '@reduxjs/toolkit';

export const store = configureStore({
  reducer: {
    sidebar: sidebarReducer,
    modal: modalReducer,
    getCategories: getCategoriesReducer,
    getUsers: getUsersReducers,
    getUser: getUserReducers,
    getProducts: productsReducers,
    getProviders: getProvidersReducer,
    getMyProducts: myProductsReducers,
    getNewProducts: newProductsReducers,
    stepper: stepperReducer,
    getCurrentUser: currentUserReducers,
    getSales: getAllSaleReducer,
    getInventory: getInventoryReducer,
    getDashboard: getDashboardReducer,
    getSupplier: getSupplierReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
