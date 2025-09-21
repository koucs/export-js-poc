import { Button as ButtonFromRoot } from '@poc/lib-react';
import { Button as ButtonFromSubpath } from '@poc/lib-react/react';

export function App() {
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: 24 }}>
      <h1>export-js-poc / React デモ</h1>
      <p>同じ Button を 2 通りの経路で import:</p>
      <div style={{ display: 'flex', gap: 12 }}>
        <ButtonFromRoot label="Root 経由" onClick={() => alert('Root import')} />
        <ButtonFromSubpath label="Subpath 経由" variant="secondary" onClick={() => alert('Subpath import')} />
      </div>
    </div>
  );
}

