"use client";

import { useEffect, useCallback } from "react";
import { ShoppingBag, X, ExternalLink } from "lucide-react";

export interface BagItem {
  id: string;
  brand: string;
  name: string;
  price: number;
  priceStr: string;
  retailer: string;
  look?: string;
  bg?: string;
}

interface BagDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: BagItem[];
  onRemoveItem: (id: string) => void;
  onCheckoutRetailer?: (retailer: string) => void;
  onCheckoutAll?: () => void;
  onExploreLooks?: () => void;
}

export default function BagDrawer({
  isOpen,
  onClose,
  items,
  onRemoveItem,
  onCheckoutRetailer,
  onCheckoutAll,
  onExploreLooks,
}: BagDrawerProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  const handleOverlayClick = useCallback(() => {
    onClose();
  }, [onClose]);

  const byRetailer: Record<string, BagItem[]> = {};
  items.forEach((item) => {
    if (!byRetailer[item.retailer]) byRetailer[item.retailer] = [];
    byRetailer[item.retailer].push(item);
  });

  const retailerNames = Object.keys(byRetailer);
  const grandTotal = items.reduce((sum, item) => sum + item.price, 0);
  const retailerCount = retailerNames.length;
  const itemCount = items.length;

  return (
    <div
      data-testid="bag-panel"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 400,
        display: "flex",
        pointerEvents: isOpen ? "all" : "none",
      }}
    >
      <div
        data-testid="bag-overlay"
        onClick={handleOverlayClick}
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(26,26,24,0.5)",
          opacity: isOpen ? 1 : 0,
          transition: "opacity 0.35s",
          cursor: "pointer",
        }}
      />

      <div
        data-testid="bag-drawer"
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          width: "100%",
          maxWidth: 480,
          background: "var(--warm-white)",
          display: "flex",
          flexDirection: "column",
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.4s cubic-bezier(0.32,0,0.15,1)",
        }}
      >
        <div
          style={{
            height: "var(--nav-h)",
            borderBottom: "1px solid var(--sand)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 28px",
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              data-testid="text-bag-title"
              style={{
                fontFamily: "'Cormorant Garamond', var(--font-cormorant), serif",
                fontSize: 18,
                fontWeight: 300,
              }}
            >
              Your Bag
            </div>
            {itemCount > 0 && (
              <div
                data-testid="text-bag-item-count"
                style={{
                  fontSize: 12,
                  fontWeight: 300,
                  color: "var(--muted)",
                }}
              >
                {itemCount} item{itemCount !== 1 ? "s" : ""}
              </div>
            )}
          </div>
          <button
            data-testid="button-bag-close"
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: 20,
              cursor: "pointer",
              color: "var(--muted)",
              lineHeight: 1,
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--charcoal)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted)")}
          >
            <X size={20} />
          </button>
        </div>

        <div
          data-testid="bag-body"
          style={{
            flex: 1,
            overflowY: "auto",
            padding: 0,
          }}
        >
          {items.length === 0 ? (
            <div
              data-testid="bag-empty-state"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                gap: 16,
                padding: 40,
                textAlign: "center",
              }}
            >
              <ShoppingBag
                size={40}
                style={{ opacity: 0.3 }}
                data-testid="img-bag-empty-icon"
              />
              <div
                data-testid="text-bag-empty-title"
                style={{
                  fontFamily: "'Cormorant Garamond', var(--font-cormorant), serif",
                  fontSize: 24,
                  fontWeight: 300,
                }}
              >
                Your bag is empty.
              </div>
              <div
                data-testid="text-bag-empty-sub"
                style={{
                  fontSize: 13,
                  fontWeight: 300,
                  color: "var(--muted)",
                  lineHeight: 1.6,
                  maxWidth: 260,
                }}
              >
                Add items from your Lookboard or while browsing looks.
              </div>
              <button
                data-testid="button-bag-explore"
                onClick={() => {
                  onClose();
                  onExploreLooks?.();
                }}
                style={{
                  padding: "12px 28px",
                  background: "var(--charcoal)",
                  color: "var(--cream)",
                  border: "none",
                  fontFamily: "'DM Sans', var(--font-dm-sans), sans-serif",
                  fontSize: 11,
                  fontWeight: 500,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  transition: "background 0.2s",
                  marginTop: 8,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bark)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "var(--charcoal)")}
              >
                Browse Looks &rarr;
              </button>
            </div>
          ) : (
            retailerNames.map((retailer) => {
              const retailerItems = byRetailer[retailer];
              const subtotal = retailerItems.reduce((s, i) => s + i.price, 0);
              return (
                <div
                  key={retailer}
                  data-testid={`bag-retailer-group-${retailer}`}
                  style={{ borderBottom: "1px solid var(--sand)" }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "16px 28px 10px",
                      background: "var(--cream)",
                    }}
                  >
                    <div
                      data-testid={`text-retailer-name-${retailer}`}
                      style={{
                        fontSize: 10,
                        letterSpacing: "0.18em",
                        textTransform: "uppercase",
                        color: "var(--bark)",
                        fontWeight: 500,
                      }}
                    >
                      {retailer}
                    </div>
                    <div
                      data-testid={`text-retailer-subtotal-${retailer}`}
                      style={{
                        fontSize: 12,
                        fontWeight: 300,
                        color: "var(--muted)",
                      }}
                    >
                      Subtotal: ${subtotal}
                    </div>
                  </div>

                  {retailerItems.map((item) => (
                    <div
                      key={item.id}
                      data-testid={`bag-item-${item.id}`}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 14,
                        padding: "14px 28px",
                        transition: "background 0.2s",
                        cursor: "default",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "var(--cream)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "")}
                    >
                      <div
                        style={{
                          width: 52,
                          height: 66,
                          position: "relative",
                          overflow: "hidden",
                          flexShrink: 0,
                          background: "var(--sand)",
                          borderRadius: 4,
                        }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          data-testid={`text-item-brand-${item.id}`}
                          style={{
                            fontSize: 10,
                            letterSpacing: "0.12em",
                            textTransform: "uppercase",
                            color: "var(--bark)",
                            marginBottom: 2,
                          }}
                        >
                          {item.brand}
                        </div>
                        <div
                          data-testid={`text-item-name-${item.id}`}
                          style={{
                            fontSize: 13,
                            color: "var(--charcoal)",
                            fontWeight: 400,
                            marginBottom: 2,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {item.name}
                        </div>
                        {item.look && (
                          <div
                            data-testid={`text-item-look-${item.id}`}
                            style={{
                              fontSize: 11,
                              fontWeight: 300,
                              color: "var(--muted)",
                            }}
                          >
                            From: {item.look}
                          </div>
                        )}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "flex-end",
                          gap: 8,
                          flexShrink: 0,
                        }}
                      >
                        <div
                          data-testid={`text-item-price-${item.id}`}
                          style={{
                            fontSize: 13,
                            color: "var(--charcoal)",
                            fontWeight: 400,
                          }}
                        >
                          {item.priceStr}
                        </div>
                        <button
                          data-testid={`button-remove-item-${item.id}`}
                          onClick={() => onRemoveItem(item.id)}
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            color: "var(--muted)",
                            fontSize: 11,
                            letterSpacing: "0.06em",
                            textTransform: "uppercase",
                            fontFamily: "'DM Sans', var(--font-dm-sans), sans-serif",
                            transition: "color 0.2s",
                            padding: 0,
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = "#8B4A2A")}
                          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted)")}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}

                  <div
                    style={{
                      padding: "10px 28px 16px",
                      display: "flex",
                      justifyContent: "flex-end",
                    }}
                  >
                    <button
                      data-testid={`button-checkout-retailer-${retailer}`}
                      onClick={() => onCheckoutRetailer?.(retailer)}
                      style={{
                        padding: "9px 20px",
                        background: "var(--warm-white)",
                        color: "var(--charcoal)",
                        border: "1.5px solid var(--sand)",
                        fontFamily: "'DM Sans', var(--font-dm-sans), sans-serif",
                        fontSize: 11,
                        fontWeight: 400,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        cursor: "pointer",
                        transition: "all 0.2s",
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "var(--stone)";
                        e.currentTarget.style.background = "var(--cream)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "var(--sand)";
                        e.currentTarget.style.background = "var(--warm-white)";
                      }}
                    >
                      Checkout at {retailer}
                      <ExternalLink size={12} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {items.length > 0 && (
          <div
            data-testid="bag-footer"
            style={{
              borderTop: "1px solid var(--sand)",
              padding: "20px 28px",
              flexShrink: 0,
              background: "var(--warm-white)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                marginBottom: 4,
              }}
            >
              <div
                data-testid="text-bag-total-label"
                style={{
                  fontSize: 11,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "var(--muted)",
                }}
              >
                Estimated Total
              </div>
              <div
                data-testid="text-bag-total-value"
                style={{
                  fontFamily: "'Cormorant Garamond', var(--font-cormorant), serif",
                  fontSize: 28,
                  fontWeight: 300,
                  color: "var(--charcoal)",
                }}
              >
                ${grandTotal}
              </div>
            </div>
            <div
              data-testid="text-bag-total-sub"
              style={{
                fontSize: 11,
                fontWeight: 300,
                color: "var(--muted)",
                marginBottom: 16,
              }}
            >
              across {retailerCount} retailer{retailerCount !== 1 ? "s" : ""}
            </div>
            <button
              data-testid="button-checkout-all"
              onClick={() => onCheckoutAll?.()}
              style={{
                width: "100%",
                padding: 15,
                background: "var(--charcoal)",
                color: "var(--cream)",
                border: "none",
                fontFamily: "'DM Sans', var(--font-dm-sans), sans-serif",
                fontSize: 12,
                fontWeight: 500,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                cursor: "pointer",
                transition: "background 0.2s",
                marginBottom: 8,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bark)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "var(--charcoal)")}
            >
              Checkout All Items
            </button>
            <div
              data-testid="text-bag-checkout-note"
              style={{
                fontSize: 11,
                fontWeight: 300,
                color: "var(--muted)",
                textAlign: "center",
                lineHeight: 1.5,
              }}
            >
              You'll be directed to each retailer to complete your purchase. Items are subject to availability.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
