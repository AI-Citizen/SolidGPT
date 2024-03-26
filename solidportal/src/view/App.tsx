import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from "./components/Home";
import React from 'react';
import {ConfigProvider} from 'antd';

const App: React.FC = () => (
    <ConfigProvider
      theme={{
        token: {
          // Seed Token
          colorPrimary: '#007fd4',
          borderRadius: 4
            
          // Alias Token
          //colorBgContainer: '#f6ffed',
        },
        components: {
            Select: {
                selectorBg: '#3c3c3c',
                optionActiveBg: '#007fd466',
                colorBorder: '#007fd466',
                colorText: '#cccccc',
                colorTextPlaceholder: '#989898',

            },
            Input: {
                colorBgContainer: '#3c3c3c',
                addonBg: '#252526',
                colorText: '#cccccc',
                colorTextPlaceholder: '#989898',

            },
            Button: {
                borderColorDisabled: '#007fd466',
            },
        }
      }}
    >
    <div><Home/></div>
    </ConfigProvider>
  );

export default App;
