import React from 'react';
import styles from './index.less'; 
import { FileTextOutlined, UngroupOutlined, TableOutlined, SettingOutlined,BulbOutlined } from '@ant-design/icons';
import homeJpeg from '@/pages/home/home.jpeg';
import { history } from 'umi'; 

const HomePage = () => {
    // 修改导航函数，使用已定义的有效路由
    const navigateToValidRoute = (route: string) => {
        localStorage.setItem('curpath', route);
        history.push(route);
    };

    // 然后修改各个按钮的onClick事件
    return (
        <div className={styles.container} style={{ backgroundImage: `url(${homeJpeg})` }}>
            <div className={styles.title}>软件开发前后端融合学习平台</div>
            <div className={styles.menuGrid}>
                {/* 左上：基础信息管理 */}
                <div className={`${styles.menuItem} ${styles.topLeft}`}>
                    <button onClick={() => navigateToValidRoute("/display/message-list")} className={styles.menuButton}>
                        <FileTextOutlined style={{ fontSize: '5rem' }} />
                        <div>基础信息管理</div>
                    </button>
                </div>

                {/* 中间：业务操作管理 */}
                <div className={`${styles.menuItem} ${styles.center}`}>
                    <button onClick={() => navigateToValidRoute("/dashboard")} className={styles.menuButton}>
                        <SettingOutlined style={{ fontSize: '6rem' }} />
                        <div>业务操作管理</div>
                    </button>
                </div>

                {/* 右上：可视化查询管理 */}
                <div className={`${styles.menuItem} ${styles.topRight}`}>
                    <button onClick={() => navigateToValidRoute("/form/basic")} className={styles.menuButton}>
                        <TableOutlined style={{ fontSize: '5rem' }} />
                        <div>可视化查询管理</div>
                    </button>
                </div>

                {/* 左下：智能化集成管理 */}
                <div className={`${styles.menuItem} ${styles.bottomLeft}`}>
                    <button onClick={() => navigateToValidRoute("/demo/page1")} className={styles.menuButton}>
                        <UngroupOutlined style={{ fontSize: '5rem' }} />
                        <div>智能化集成管理</div>
                    </button>
                </div>

                {/* 右下：预警报警管理 */}
                <div className={`${styles.menuItem} ${styles.bottomRight}`}>
                    <button onClick={() => navigateToValidRoute("/user/list")} className={styles.menuButton}>
                        <BulbOutlined style={{ fontSize: '5rem' }} />
                        <div>预警报警管理</div>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HomePage;