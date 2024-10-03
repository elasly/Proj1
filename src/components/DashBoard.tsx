

import Link from 'next/link';
import React from 'react';

export function TopBar() {
    return (
        <header>
        <div style={{ width: '100%', height: '100%', padding: '32px', background: '#1E1E1E', borderBottom: '1px #444444 solid', justifyContent: 'flex-start', alignItems: 'center', gap: '24px', display: 'inline-flex' }}>
            <div style={{ justifyContent: 'flex-start', alignItems: 'center', gap: '24px', display: 'flex' }}>
                <div style={{ height: '35px', justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
                    <div style={{ width: '23.33px', height: '35px', border: '3.50px white solid' }}></div>
                </div>
            </div>
            <div style={{ flex: '1 1 0', height: '32px', justifyContent: 'flex-end', alignItems: 'center', gap: '8px', display: 'flex' }}>
                <div style={{ padding: '8px', background: '#444444', borderRadius: '8px', justifyContent: 'center', alignItems: 'center', gap: '8px', display: 'flex' }}>
                    <div style={{ color: '#F5F5F5', fontSize: '16px', fontFamily: 'Inter', fontWeight: '400', lineHeight: '16px', wordWrap: 'break-word' }}>Pricing</div>
                </div>
                <div style={{ padding: '8px', borderRadius: '8px', justifyContent: 'center', alignItems: 'center', gap: '8px', display: 'flex' }}>
                    <div style={{ color: 'white', fontSize: '16px', fontFamily: 'Inter', fontWeight: '400', lineHeight: '16px', wordWrap: 'break-word' }}>Solutions</div>
                </div>
                <div style={{ padding: '8px', borderRadius: '8px', justifyContent: 'center', alignItems: 'center', gap: '8px', display: 'flex' }}>
                    <div style={{ color: 'white', fontSize: '16px', fontFamily: 'Inter', fontWeight: '400', lineHeight: '16px', wordWrap: 'break-word' }}>Community</div>
                </div>
                <div style={{ padding: '8px', borderRadius: '8px', justifyContent: 'center', alignItems: 'center', gap: '8px', display: 'flex' }}>
                    <div style={{ color: 'white', fontSize: '16px', fontFamily: 'Inter', fontWeight: '400', lineHeight: '16px', wordWrap: 'break-word' }}>Resources</div>
                </div>
                <div style={{ padding: '8px', borderRadius: '8px', justifyContent: 'center', alignItems: 'center', gap: '8px', display: 'flex' }}>
                    <div style={{ color: 'white', fontSize: '16px', fontFamily: 'Inter', fontWeight: '400', lineHeight: '16px', wordWrap: 'break-word' }}>Pricing</div>
                </div>
                <div style={{ padding: '8px', borderRadius: '8px', justifyContent: 'center', alignItems: 'center', gap: '8px', display: 'flex' }}>
                    <div style={{ color: 'white', fontSize: '16px', fontFamily: 'Inter', fontWeight: '400', lineHeight: '16px', wordWrap: 'break-word' }}>Contact</div>
                </div>
            </div>
            <div style={{ height: '32px', justifyContent: 'flex-start', alignItems: 'center', gap: '12px', display: 'flex' }}>
                <div style={{ flex: '1 1 0', height: '32px', padding: '8px', background: '#303030', borderRadius: '8px', overflow: 'hidden', border: '1px #949494 solid', justifyContent: 'center', alignItems: 'center', gap: '8px', display: 'flex' }}>
                    <div style={{ color: 'white', fontSize: '16px', fontFamily: 'Inter', fontWeight: '400', lineHeight: '16px', wordWrap: 'break-word' }}>
                        <Link href="/api/auth/signin">Sign In</Link>
                        </div>
                </div>
                <div style={{ flex: '1 1 0', height: '32px', padding: '8px', background: '#F5F5F5', borderRadius: '8px', overflow: 'hidden', border: '1px #F5F5F5 solid', justifyContent: 'center', alignItems: 'center', gap: '8px', display: 'flex' }}>
                    <div style={{ color: '#1E1E1E', fontSize: '16px', fontFamily: 'Inter', fontWeight: '400', lineHeight: '16px', wordWrap: 'break-word' }}>Register</div>
                </div>
            </div>
        </div>
        </header>
    );
}