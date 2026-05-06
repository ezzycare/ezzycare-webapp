import ThemeToggle from '@/components/Base/ThemeToogle';
import { Button } from '@/components/Ui/Button';
import {
  PasswordInput,
  PhoneInput,
  TextInput,
} from '@/components/Ui/TextInput';

const page = () => {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen w-full gap-2">
      <div className="flex items-center gap-3">
        <h3 className="text-text">Button: </h3>

        <div className="flex items-center gap-3">
          <Button>Button</Button>
          <Button variant="secondary">Button</Button>
          <Button variant="outline">Button</Button>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <h3 className="text-text">Theme toggle: </h3>

        <ThemeToggle />
      </div>
      <div className="flex items-center gap-3">
        <h3 className="text-text">Text Input</h3>

        <div className="flex flex-col items-center gap-3">
          <TextInput placeholder="Enter email" label="Email" />
          <PasswordInput placeholder="Enter password" label="Password" />
          <PhoneInput placeholder="Enter phone number" label="Phone Number" />
        </div>
      </div>
    </div>
  );
};

export default page;
