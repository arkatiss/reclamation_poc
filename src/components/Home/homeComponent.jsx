import React, { useState,useEffect } from 'react';
import { chatBotIcon, clearIcon, csLogo, userImage } from '../../assests/images';
import { botIcon, sender } from '../../assests/icons';
import { Input } from "antd";

const HomeComponent = (props) => {
  const [isISAdmin, setIsISAdmin] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState([]);
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };
  /**
    @remarks
    Function to handle user chat section
    @author Raja
    */
  const sendMessage = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      if (inputValue.trim() !== '') {
        setMessages([...messages, inputValue]);
        setInputValue('');
      }
    }
  };
  /**
      @remarks
      Function to handle clear the chat section
      @author Raja
      */
  const clearChat = () => {
    setMessages([]);
  }

  useEffect(() => {
  try {
    const storedData = sessionStorage.getItem('userData');
    const userObj = storedData ? JSON.parse(storedData) : null;
    const role = userObj?.[0].divisionData?.[0]?.ROLE || '';
    if (role.includes('IS Admin') || role.includes('Admin') || role.includes('All Read')) {
      setIsISAdmin(true);
    }
  } catch (error) {
    console.error('Error parsing userData from sessionStorage:', error);
  }
}, []);

  return (
    <div className='container-fluid'>
     <div className="d-flex flex-column justify-content-center align-items-center home-page text-center">
     

          <b className="home-page-check text-center">Home Page will be Available in Version-2</b>

          
    
    </div>
      {/*** <div className='row m-0'>
        <div className='col-sm-4'>
          <div className='d-flex justify-content-center' style={{ height: '94vh' }}>
            <div className='chat-card'>
              <div className='chat-header d-flex justify-content-between align-items-center'>
                <span>Reclamation Bot</span>
                {messages.length > 0 &&
                  <span className='label pointer' style={{ color: '#fff' }} onClick={clearChat}>Clear</span>
                }
              </div>
              <div className='chat-content'>
                <div className='chat-messages'>
                  <span className='system-chat d-flex justify-content-start align-items-end mb-2'>
                    <span className='bot-img-icon me-2'>
                      <img src={botIcon} alt='bot' width={24} height={24} />
                    </span>
                    <span className='system-chat-section'>Hi I’m Reclamation virtual assistance, how can i help you today !</span>
                  </span>
                  {messages.map((msg, index) => (
                    <span className='user-chat d-flex justify-content-end align-items-end mb-2'>
                      <span className='user-chat-section'>{msg}</span><img src={userImage} alt='bot' className='ms-2' width={32} height={32} />
                    </span>
                  ))}
                </div>
              </div>
              <div className='chat-footer'>
                <span className='chat-input'>
                  <Input placeholder='Ask me anything' className='inputField' onChange={handleInputChange} value={inputValue} onKeyPress={sendMessage} />
                  <span className='bot-img-icon ms-2'>
                    <img src={sender} alt='sender' width={20} height={16} className='pointer' onClick={sendMessage} />
                  </span>
                </span>

              </div>
            </div>
          </div>
        </div>
        <div className='col-sm-8 d-flex align-items-center'>
          <div className='right-card'>
            <img src={csLogo} alt='cands' />
            <span className='page-title f-30 mt-3'>Welcome to Reclamation</span>
          </div>
        </div>

      </div> ***/}
      {/* <div className='row m-0'>
        <div className='d-flex justify-content-end'>
          <img src={clearIcon} className='pointer' alt='chat-clear' title='Clear Chat' width={24} height={24} onClick={clearChat}/>
        </div>
        <div className='row m-0' style={{ height: '85vh', overflow: 'auto' }}>
          <div className='row m-0' style={{ height: '70vh' }}>
            <div className='d-flex justify-content-center text-center flex-column'>
              <img src={chatBotIcon} alt='chatbot-icon' width={'100px'} className='ms-auto me-auto' />
              <span className='page-title f-30 mt-3'>Welcome to Reclamation</span>
              <span className='ms-auto me-auto f-16' style={{ maxWidth: '500px'}}>I'm here to assist you with any questions you may have, Whether you need information, guidance
              or just want to have a friendly chat, I'm at your service.</span>
            </div>
          </div>
          <div className='chat-content'>
            <div className='chat-messages'>
              <span className='system-chat d-flex justify-content-start align-items-end mb-2'>
                
                  <img src={chatBotIcon} alt='bot' width={24} height={24} />
                
                <span className='system-chat-section ms-2 f-16'>Hi I’m Reclamation virtual assistance, how can i help you today !</span>
              </span>
              {messages.map((msg, index) => (
                <span className='user-chat d-flex justify-content-end align-items-end mb-2'>
                  <span className='user-chat-section f-16'>{msg}</span><img src={userImage} alt='bot' className='ms-2' width={32} height={32} />
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className='row m-0'>
          <span className='chat-input'>
            <Input placeholder='Ask me anything' className='inputField' onChange={handleInputChange} value={inputValue} onKeyPress={sendMessage} />
            <span className='bot-img-icon ms-2'>
              <img src={sender} alt='sender' width={20} height={16} className='pointer' onClick={sendMessage} />
            </span>
          </span>

        </div>
      </div> */}
    </div>

  )
}

export default HomeComponent