import * as React from "react";
import styled from "styled-components";

import { Container, ContainerListItem } from "./ContainerListItem2";

interface ContainerListProps {
  containers: Container[];
}

interface IContainerListWrapperProps {
  hasContainers: boolean;
}

const ContainerListWrapper = styled.div<IContainerListWrapperProps>`
  display: grid;

  grid-template-columns: repeat(3, minmax(50px, 1fr));
  grid-gap: 1px;
`;

export const CL: React.FC<ContainerListProps> = ({ containers }) => {
  return (
    <ContainerListWrapper hasContainers={containers.length !== 0}>
      {containers.length === 0 && <h1>No containers to show</h1>}
      {containers.map(container => (
        <ContainerListItem key={container.name} {...container} />
      ))}
    </ContainerListWrapper>
  );
};
