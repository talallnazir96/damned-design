import RibbonClasses from "./Ribbon.module.css";
export function PreOrderRibbon() {
  return (
    <div
      className={`${RibbonClasses.preSaleWrapper} ${RibbonClasses.ribbonLeft}`}
    >
      <div className={RibbonClasses.preSaleRibbonText}>Pre Order</div>
    </div>
  );
}

export function SaleRibbon() {
  return (
    <div className={RibbonClasses.saleRibbonWrapper}>
      <div className={RibbonClasses.saleText}>Sale!</div>
    </div>
  );
}

export function OutOfStockRibbon() {
  return (
    <div className={RibbonClasses.outOfStockWrapper}>
      <div className={RibbonClasses.outOfStockText}>Sold Out!</div>
    </div>
  );
}

export function PreOrderWarningRibbon() {
  return (
    <div className={RibbonClasses.preOrderWarningWrapper}>
      <div className={RibbonClasses.preOrderWarningText}>
        Please make a note of the estimated ship date as this product is on pre
        order
      </div>
    </div>
  );
}
