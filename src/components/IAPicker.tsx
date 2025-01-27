import CustomButton from './CustomButton';

const AIPicker = ({ prompt, setPrompt, generatingImg, handlerSubmit }) => {
  return (
    <div className="aipicker-container">
      <textarea
        placeholder="Ask AI..."
        rows={5}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="aipicker-textarea"
      />
      <div className="flex flex-wrap gap-3">
        {generatingImg ? (
          <CustomButton
            type="outline"
            title="Asking AI..."
            customStyle="text-xs"
            handleClick={() => false }
          />
        ) : (
          <>
            <CustomButton
              type="outline"
              title="AI Logo"
              handleClick={() => handlerSubmit('logo')}
              customStyle="text-xs"
            />

            <CustomButton
              type="filled"
              title="AI Full"
              handleClick={() => handlerSubmit('full')}
              customStyle="text-xs"
            />
          </>
        )}
      </div>
    </div>
  )
}

export default AIPicker