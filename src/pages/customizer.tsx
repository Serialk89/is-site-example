import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useSnapshot } from 'valtio';
import state from '../store';
import { reader } from '../config/helpers';
import { EditorTabs, FilterTabs, DecalTypes } from '../config/constants';
import { slideAnimation } from '../config/motion';
import { Tab, ColorPicker, CustomButton, FilePicker, IAPicker } from '../components';


const Customize = () => {
  const snap = useSnapshot(state);
  const [file, setFile] = useState('');
  const [prompt, setPrompt] = useState('')
  const [generatingImg, setGeneratingImg] = useState(false);
  const [activeEditorTab, setActiveEditorTab] = useState('');
  const [activeFilterTab, setActiveFilterTab] = useState({
    logoShirt: true,
    stylishShirt: false
  })

  // show tab content depending on the activeTab
  const generateTabContent = () => {
    switch (activeEditorTab) {
      case 'colorpicker':
        return <ColorPicker />
      case "filepicker":
        return <FilePicker
          file={file}
          setFile={setFile}
          readFile={readFile}
        />
      case 'aipicker':
        return <IAPicker
          prompt={prompt}
          setPrompt={setPrompt}
          generatingImg={generatingImg}
          handlerSubmit={handlerSubmit}
        />
      default:
        return null
    }
  }

  const handlerSubmit = async (type) => {
    if (!prompt) return false;

    try {
      setGeneratingImg(true);
      const response = await fetch('http://localhost:8080/api/v1/dalle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({prompt})
      });
      
      const data = await response.json();

      handleDecals(type, `data:image/png;base64,${data.photo.data[0].b64_json}`);

    } catch (error) {
      console.log(error);
    } finally {
      setGeneratingImg(false);
      setActiveEditorTab("");
    }
  }

  const readFile = (type) => {
    reader(file)
      .then((result) => {
        handleDecals(type, result);
        setActiveEditorTab("");
      })
  }

  const handleDecals = (type, result) => {
    const decalType = DecalTypes[type];

    state[decalType.stateProperty] = result;

    if (!activeFilterTab[decalType.filterTab]) {
      handleActiveFilterTab(decalType.filterTab);
    }
  }

  const handleActiveFilterTab = (tabName) => {
    switch (tabName) {
      case "logoShirt":
        state.isLogoTexture = !activeFilterTab[tabName];
        break;
      case "stylishShirt":
        state.isFullTexture = !activeFilterTab[tabName];
        break;
      default:
        state.isLogoTexture = true;
        state.isFullTexture = false;
        break;
    }

    // after setting the state, activeFilterTab is updated

    setActiveFilterTab((prevState) => {
      return {
        ...prevState,
        [tabName]: !prevState[tabName]
      }
    })
  }

  return (
    <AnimatePresence>
      {!snap.intro && (
        <>
          <motion.div
            key="custom"
            className="absolute top-0 left-0 z-0"
            {...slideAnimation("left")}
          >
            <div className='flex items-center min-h-screen'>
              <div className='editortabs-container tabs'>
                {EditorTabs.map((tab) => (
                  <Tab 
                    key={tab.name} 
                    tab={tab}
                    isFilterTab={false}
                    isActiveTab={false} 
                    handleClick={() => setActiveEditorTab(tab.name)} />
                ))}
                {generateTabContent()}
              </div>
            </div>
          </motion.div>
          <motion.div className='absolute z-10 top-5 right-5'>
            <CustomButton type='filled' title='Go Back' handleClick={() => state.intro = true} customStyle='w-fit px-4 py-2.5 font-bold text-sm' />
          </motion.div>
          <motion.div className='filtertabs-container' {...slideAnimation("up")}>
            {FilterTabs.map((tab) => (
              <Tab 
                key={tab.name} 
                tab={tab} 
                isFilterTab 
                isActiveTab={activeFilterTab[tab.name]} 
                handleClick={() => handleActiveFilterTab(tab.name)} 
              />
            ))}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default Customize