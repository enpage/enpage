import { tx } from "@upstart.gg/style-system/twind";

export const jsonFormClass = tx`text-gray-900 dark:text-gray-50
  [&>.form-group:has(*)]:(!my-0)
  [&_label]:(text-sm leading-tight)
  [&_label.file-title]:(leading-5)
  [&_label.label.file-label]:(mb-0)
  [&_.control-label]:(block text-sm font-medium)
  [&_fieldset]:(flex flex-col)
  [&_.form-group:has(*)]:(px-3)
  [&_.form-group.field-object:has(*)]:(pt-0)
  [&_.section-fields>div:last-child>div]:(border-none)
  [&_.section-fields]:(flex flex-col gap-4)
  [&_.form-section]:(pb-4 gap-3 flex flex-col)
  [&_.form-section_.field-object_.form-group:last-child]:(border-none)
  [&>.form-group]:(!px-0 !py-0)
  [&_.field-object]:(border-none flex flex-col gap-3)
  [&_.field-description]:(mt-1 mb-1 text-xs text-gray-600 dark:text-white/50 leading-tight)
  [&.hide-help_.field-description]:(hidden)
  [&_[type="submit"]]:(bg-upstart-600 text-white py-1 px-4 block w-full rounded mt-6)
  [&_input[type="text"]]:(w-full mt-1 px-1.5 py-1.5 text-sm border border-gray-300 dark:border-transparent dark:bg-dark-800 rounded-md focus:ring-1 focus:border-upstart-500 focus:ring-upstart-500)
  [&_input[type="url"]]:(w-full mt-1 px-1.5 py-1.5 text-sm border border-gray-300 dark:border-transparent dark:bg-dark-800 rounded-md focus:ring-1 focus:border-upstart-500 focus:ring-upstart-500)
  [&_input[type="datetime-local"]]:(w-full mt-1 px-1.5 py-1.5 text-sm border border-gray-300 dark:border-transparent dark:bg-dark-800 rounded-md focus:ring-1 focus:border-upstart-500 focus:ring-upstart-500)
  [&_input[type="number"]]:(w-full mt-1 p-2 py-1.5 text-sm border border-gray-300 dark:border-transparent dark:bg-dark-800 rounded-md focus:ring-1 focus:border-upstart-500 focus:ring-upstart-500)
  [&_textarea]:(w-full p-2 py-1.5 mt-1 text-sm border border-gray-300 dark:border-transparent dark:bg-dark-800 rounded-md focus:ring-1 focus:border-upstart-500 focus:ring-upstart-500)
  [&_select]:(w-full p-2 py-1.5 text-sm border border-gray-300 dark:border-transparent dark:bg-dark-800 rounded-md focus:ring-1 focus:border-upstart-500 focus:ring-upstart-500)
`;

export const fieldLabel = tx`text-sm font-medium dark:text-gray-50`;
export const fieldDescription = tx`text-xs text-gray-500 dark:text-white/50 leading-tight`;
