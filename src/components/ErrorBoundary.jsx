import { Component } from 'react';

// CoupleFit keeps its entire history in localStorage with no server-side
// backup (see ARCHITECTURE.md). Without this boundary, a single render
// exception mid-workout — corrupted JSON, a missing exercise id — blanks the
// screen with no way back except clearing site data, which also erases that
// history. Reloading first is nearly always enough since the bad state
// rarely survives a fresh read of storage.
export default class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error, info) {
        console.error('CoupleFit crashed:', error, info);
    }

    handleReload = () => {
        window.location.reload();
    };

    render() {
        if (!this.state.hasError) {
            return this.props.children;
        }

        return (
            <div className="fixed inset-0 bg-ios-bg text-white flex flex-col items-center justify-center p-6 text-center gap-4 z-[999]">
                <span className="text-[40px]" aria-hidden="true">⚠️</span>
                <h1 className="text-[20px] font-extrabold">Something went wrong</h1>
                <p className="text-[14px] text-gray-400 max-w-xs">
                    CoupleFit hit an unexpected error. Your saved workouts are untouched — reloading usually fixes this.
                </p>
                <button
                    onClick={this.handleReload}
                    className="mt-2 px-6 py-3 bg-ios-blue text-white font-bold rounded-2xl active:scale-95 transition-transform"
                >
                    Reload
                </button>
            </div>
        );
    }
}
