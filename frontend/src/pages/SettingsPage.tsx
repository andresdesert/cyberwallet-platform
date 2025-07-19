// src/pages/SettingsPage.tsx

import React, { Suspense, lazy } from 'react';
import {
  Typography,
  Divider,
  Skeleton,
  Box,
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import AppLayout from '@/layout/AppLayout';
import PageContainer from '@/layout/PageContainer';

const PreferencesSection = lazy(() => import('@/components/Settings/PreferencesSection'));
const SecuritySection = lazy(() => import('@/components/Settings/SecuritySection'));
const NotificationsSection = lazy(() => import('@/components/Settings/NotificationsSection'));
const SessionSection = lazy(() => import('@/components/Settings/SessionSection'));
const DangerZoneSection = lazy(() => import('@/components/Settings/DangerZoneSection'));
const AvatarUploader = lazy(() => import('@/components/Settings/AvatarUploader'));

const SettingsPage: React.FC = () => {
  return (
      <AppLayout>
        <PageContainer maxWidth={900}>
          <Box display="flex" alignItems="center" gap={2} mb={4}>
            <SettingsIcon color="primary" fontSize="large" />
            <Typography variant="h4" fontWeight={600}>
              Configuración
            </Typography>
          </Box>

          <Suspense fallback={<Skeleton variant="rectangular" height={120} />}>
            <PreferencesSection />
          </Suspense>
          <Divider sx={{ my: 4 }} />

          <Suspense fallback={<Skeleton variant="rectangular" height={120} />}>
            <SecuritySection />
          </Suspense>
          <Divider sx={{ my: 4 }} />

          <Suspense fallback={<Skeleton variant="rectangular" height={120} />}>
            <NotificationsSection />
          </Suspense>
          <Divider sx={{ my: 4 }} />

          <Suspense fallback={<Skeleton variant="rectangular" height={120} />}>
            <SessionSection />
          </Suspense>
          <Divider sx={{ my: 4 }} />

          <Suspense fallback={<Skeleton variant="rectangular" height={120} />}>
            <DangerZoneSection />
          </Suspense>
          <Divider sx={{ my: 4 }} />

          <Suspense fallback={<Skeleton variant="rectangular" height={200} />}>
            <AvatarUploader />
          </Suspense>
        </PageContainer>
      </AppLayout>
  );
};

export default SettingsPage;
