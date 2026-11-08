'use client';
import { Component, type ReactNode } from 'react';

type Props = { children: ReactNode; onError: () => void };
type State = { failed: boolean };

/** Keeps the information-first 2D portfolio usable if GPU rendering fails. */
export default class SceneErrorBoundary extends Component<Props, State> {
  state: State = { failed: false };
  static getDerivedStateFromError(): State { return { failed: true }; }
  componentDidCatch(error: Error) {
    console.error('3D studio rendering failed. Switching to the accessible fallback.', error);
    this.props.onError();
  }
  render() {
    return this.state.failed ? <div className="canvas-fallback"><p>3D VIEW UNAVAILABLE</p></div> : this.props.children;
  }
}
