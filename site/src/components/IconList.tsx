import {Button, Box, chakra, useBreakpointValue} from '@chakra-ui/react';
import Link from 'next/link';
import {useRouter} from 'next/router';
import {memo, useContext} from 'react';
import IconListItem from './IconListItem';
import {IconEntity} from '../types';
import {IconStyleContext} from "./CustomizeIconContext";
import {AutoSizer, Grid, WindowScroller} from 'react-virtualized';
import useSpacing from "../lib/useSpacing";

interface IconListProps {
  icons: IconEntity[];
  rows?: number;
  currentIcon?: IconEntity;
  hideVersionBadges?: boolean;
  currentVersion: string;
}

const IconList = ({icons, rows, currentIcon, currentVersion, hideVersionBadges}: IconListProps) => {
  const columnCount = typeof window !== 'undefined' ? useBreakpointValue({base: 2, sm: 4, md: 6, lg: 8, xl: 10}, {ssr: false}) : 10;
  const router = useRouter();
  const {color, size, strokeWidth} = useContext(IconStyleContext);
  const styles = {
    '--lucide-stroke-color': color,
    '--lucide-stroke-width': strokeWidth,
    '--lucide-icon-size': size,
  };

  const CellRenderer = ({isScrolling, isVisible, columnIndex, rowIndex, style}) => {
    const iconIndex = rowIndex * columnCount + columnIndex;
    if (iconIndex > icons.length - 1) {
      return null;
    }
    if (!isVisible || isScrolling) {
      return (
        <chakra.div style={style}
                    p={useSpacing('containerHalf')}
        >
          <Button variant="iconListItem"
                  className={'icon-list-item'}
                  opacity={0.5}
          ></Button>
        </chakra.div>
      );
    }
    const icon = icons[iconIndex];
    if (!icon) {
      return null;
    }
    return (
      <chakra.div style={style}
           p={useSpacing('containerHalf')}
      >
        <Link
          key={icon.name}
          scroll={false}
          shallow={true}
          href={{
            pathname: '/icons/[iconName]',
            query: {
              ...router.query,
              iconName: icon.name,
            },
          }}
        >
          <IconListItem {...icon} active={icon.name === currentIcon?.name} hideVersionBadge={hideVersionBadges} currentVersion={currentVersion} />
        </Link>
      </chakra.div>
    );
  };

  return (
    <Box m={useSpacing('containerHalf').map((m) => -1 * m)} style={styles}>
      <WindowScroller>
        {({height, scrollTop}) => (
          <AutoSizer disableHeight>
            {({width}) => (
              <Grid
                tabIndex={null}
                autoHeight
                height={height}
                width={width}
                scrollTop={scrollTop}
                cellRenderer={CellRenderer}
                columnCount={columnCount}
                rowHeight={80+16}
                columnWidth={80+16}
                rowCount={rows ?? Math.ceil(icons.length / columnCount)}
                overscanRowCount={5}
                containerStyle={{margin: 'auto'}}
              />
            )}
          </AutoSizer>
        )}
      </WindowScroller>
    </Box>
  );
};

export default IconList;
