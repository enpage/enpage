import { createContext, useContext, useState } from "react";
import type { TArray, TObject, TSchema } from "@sinclair/typebox";
import { tx } from "@twind/core";
import { Text, Select } from "@upstart.gg/style-system/system";

type ChoiceContextProps = {
  onChange: (value: string) => void;
  allowArraySelection?: boolean;
};

const NestingContext = createContext(0);
const ChoiceContext = createContext<ChoiceContextProps>({
  onChange: () => {},
});

function SchemaEntry(props: TSchema) {
  const nestingLevel = useContext(NestingContext);
  const { onChange } = useContext(ChoiceContext);
  return (
    <NestingContext.Provider value={nestingLevel + 1}>
      <ul id={`${props.name}_level-${nestingLevel}`} className={tx("mb-1 list-[square] pl-2")}>
        {props.type === "object" ? (
          <SchemaObject {...(props as TObject)} />
        ) : props.type === "array" ? (
          <SchemaArray {...(props as TArray)} />
        ) : (
          <li>
            <Text
              size="2"
              onClick={() => onChange(props.name)}
              className={tx("hover:bg-upstart-200 bg-upstart-100 cursor-pointer px-1.5 py-1 rounded")}
            >
              {props.name}
            </Text>
            {props.optional && (
              <Text color="gray" size="1" className="ml-1">
                (optional)
              </Text>
            )}{" "}
            <Text color="gray" size="1">
              ({props.enum ? `"${props.enum.join('" | "')}"` : props.type})
            </Text>
          </li>
        )}
      </ul>
    </NestingContext.Provider>
  );
}

function SchemaArray(props: TArray) {
  const { items, name, required } = props;
  const { onChange, allowArraySelection } = useContext(ChoiceContext);
  return (
    <ul className="list-[square]">
      {name && (
        <li>
          <Text size="2">
            {allowArraySelection ? (
              <Text size="2" onClick={() => onChange(name)}>
                {name} ARRAY name
              </Text>
            ) : (
              name
            )}
            {props.optional && (
              <Text color="gray" size="1" className="ml-1">
                (Optional)
              </Text>
            )}
          </Text>
        </li>
      )}

      <SchemaEntry {...items} optional={required && !required.includes(name)} />
    </ul>
  );
}

function SchemaObject({ name, required, allOf, properties, ...rest }: TObject) {
  const renderProperties = properties;
  // if (allOf) {
  //   const newProperties = allOf.reduce((acc, obj) => {
  //     if (obj.properties) {
  //       return {...acc, ...obj.properties}
  //     }
  //   }, {})
  //   console.log(allOf)
  //   if (allOf.oneOf) {
  //     renderProperties = allOf.oneOf.map(variant => ({ ...allOf, ...variant }));
  //   } else {
  //     renderProperties = {...allOf};
  //   }
  //   // console.log(renderProperties);
  // }
  if (properties)
    return (
      <ul className="list-disc">
        <li className={tx({ hidden: !name })}>
          <span>{name} my name</span>
        </li>
        {Object.entries(renderProperties).map(([name, value], i) => (
          <SchemaEntry
            key={`${name}-${i}`}
            name={name}
            optional={required && !required.includes(name)}
            {...value}
          />
        ))}
      </ul>
    );
  return null;
}

export function JSONSchemaView({
  schema,
  onChange,
}: { schema: TSchema; onChange: ChoiceContextProps["onChange"] }) {
  return (
    <ChoiceContext.Provider value={{ onChange }}>
      <NestingContext.Provider value={0}>
        <SchemaEntry {...schema} />
      </NestingContext.Provider>
    </ChoiceContext.Provider>
  );
}
