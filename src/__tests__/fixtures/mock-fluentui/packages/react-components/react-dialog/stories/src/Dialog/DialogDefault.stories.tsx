/**
 * Mock Dialog default story for scraper testing.
 */
import * as React from 'react';
import {
  Dialog,
  DialogTrigger,
  DialogSurface,
  DialogBody,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@fluentui/react-components';

/**
 * A default Dialog component.
 */
export const Default = () => (
  <Dialog>
    <DialogTrigger>
      <Button>Open Dialog</Button>
    </DialogTrigger>
    <DialogSurface>
      <DialogBody>
        <DialogTitle>Dialog Title</DialogTitle>
        <DialogContent>Dialog Content</DialogContent>
        <DialogActions>
          <Button appearance="primary">OK</Button>
          <Button>Cancel</Button>
        </DialogActions>
      </DialogBody>
    </DialogSurface>
  </Dialog>
);
