// material
import { Box, Grid, Container, Typography } from '@material-ui/core';
// components
import { useState, useEffect } from 'react';
import Page from '../../components/Page';
import {
  WordreplaceCounter,
  WordfilterCounter,
  SearchDatabaseCounter,
  SearchCounter,

} from '../../components/_dashboard/app';
import { withSnackbar } from '../../hooks/withSnackbar';

import { api } from '../../services';

// ----------------------------------------------------------------------

const DashboardApp = (props) => 
 (
    <Page title="Dashboard | Tasi Framework">
      <Container maxWidth="xl">
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <WordreplaceCounter />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <WordfilterCounter />
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <SearchDatabaseCounter />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <SearchCounter />
          </Grid>
        </Grid>
      </Container>
    </Page>
);

export default withSnackbar(DashboardApp)
