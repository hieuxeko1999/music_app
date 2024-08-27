'use client'

import React from 'react';
import styles from '../styles/footer.module.scss';

interface FooterProps { }

const AppFooter: React.FC<FooterProps> = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.footerContent}>
                <ul className={styles.footerLinks}>
                    <li className={styles.footerLinkItem}>
                        <a href="/" className={styles.footerLink}>
                            Home
                        </a>
                    </li>
                    <li className={styles.footerLinkItem}>
                        <a href="/about" className={styles.footerLink}>
                            About
                        </a>
                    </li>
                    <li className={styles.footerLinkItem}>
                        <a href="/contact" className={styles.footerLink}>
                            Contact
                        </a>
                    </li>
                </ul>
            </div>
            <div className={styles.footerCopyright}>
                <p className={styles.copyright}>© 2024 SnextGen's Team nocopyright.</p>
            </div>
        </footer>
    );
};

export default AppFooter;