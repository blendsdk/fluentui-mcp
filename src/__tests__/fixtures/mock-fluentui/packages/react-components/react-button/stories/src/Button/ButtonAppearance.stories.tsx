/**
 * Mock Button appearance story for scraper testing.
 * Mimics the real FluentUI story format.
 */
import * as React from 'react';
import { Button } from '@fluentui/react-components';

/**
 * A button can have different visual appearances.
 */
export const Appearance = () => (
  <>
    <Button appearance="primary">Primary</Button>
    <Button appearance="secondary">Secondary</Button>
    <Button appearance="outline">Outline</Button>
    <Button appearance="subtle">Subtle</Button>
    <Button appearance="transparent">Transparent</Button>
  </>
);
