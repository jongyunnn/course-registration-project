"use client";

import { useEffect } from "react";
import { useWindowVirtualizer } from "@tanstack/react-virtual";

const ESTIMATED_ROW_HEIGHT_PX = 280;
const OVERSCAN_COUNT = 3;
const COLUMNS_PER_ROW = 2;

interface UseCourseVirtualizerOptions {
  itemCount: number;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
}

export function useCourseVirtualizer({
  itemCount,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
}: UseCourseVirtualizerOptions) {
  const rowCount = Math.ceil(itemCount / COLUMNS_PER_ROW);

  const virtualizer = useWindowVirtualizer({
    count: hasNextPage ? rowCount + 1 : rowCount,
    estimateSize: () => ESTIMATED_ROW_HEIGHT_PX,
    overscan: OVERSCAN_COUNT,
  });

  useEffect(() => {
    virtualizer.measure();
  }, [virtualizer]);

  const virtualItems = virtualizer.getVirtualItems();
  const lastItem = virtualItems[virtualItems.length - 1];

  useEffect(() => {
    if (!lastItem) {
      return;
    }

    const isNearEnd = lastItem.index >= rowCount - 1;
    const shouldFetchMore = isNearEnd && hasNextPage && !isFetchingNextPage;

    if (shouldFetchMore) {
      fetchNextPage();
    }
  }, [lastItem, rowCount, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const getRowItems = <T,>(items: T[], rowIndex: number) => {
    const leftItem = items[rowIndex * COLUMNS_PER_ROW];
    const rightItem = items[rowIndex * COLUMNS_PER_ROW + 1];
    return { leftItem, rightItem };
  };

  const isLoaderRow = (rowIndex: number) => rowIndex > rowCount - 1;

  return {
    virtualizer,
    virtualItems,
    rowCount,
    totalSize: virtualizer.getTotalSize(),
    getRowItems,
    isLoaderRow,
  };
}
