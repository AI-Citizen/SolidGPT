import React, {useState} from 'react';
import {Modal, Form, Input, Button} from 'antd';

const AWSLogin = ({
                      visible, setVisible, onLoginFinish, onLoginFail
                  }) => {

    const handleCancel = () => {
        setVisible(false);
        console.log('Close');
        onLoginFail();
    };

    return (<>
        <Modal
            title="AWS Login"
            open={visible}
            onCancel={handleCancel}
            footer={null}
        >
            <Form
                name="login_form"
                initialValues={{remember: true}}
                onFinish={onLoginFinish}
            >
                <Form.Item
                    name="username"
                    rules={[{required: true, message: 'Please input your username!'}]}
                >
                    <Input placeholder="access key id"/>
                </Form.Item>
                <Form.Item
                    name="password"
                    rules={[{required: true, message: 'Please input your password!'}]}
                >
                    <Input.Password placeholder="secret access key"/>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" style={{width: '100%'}}>
                        Log in
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    </>);
};

export default AWSLogin;
