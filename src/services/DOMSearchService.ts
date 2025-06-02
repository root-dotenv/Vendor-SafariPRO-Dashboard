// DOM Search Service - handles text highlighting and navigation
export class DOMSearchService {
  private static instance: DOMSearchService;
  private currentMatches: HTMLElement[] = [];
  private currentIndex: number = -1;
  private searchTerm: string = "";
  private highlightClass = "search-highlight";
  private activeHighlightClass = "search-highlight-active";

  private constructor() {
    this.injectStyles();
  }

  public static getInstance(): DOMSearchService {
    if (!DOMSearchService.instance) {
      DOMSearchService.instance = new DOMSearchService();
    }
    return DOMSearchService.instance;
  }

  private injectStyles(): void {
    // Check if styles already exist
    if (document.getElementById("dom-search-styles")) return;

    const styleSheet = document.createElement("style");
    styleSheet.id = "dom-search-styles";
    styleSheet.textContent = `
        .${this.highlightClass} {
          background-color: #ffeb3b !important;
          color: #000 !important;
          padding: 1px 2px !important;
          border-radius: 2px !important;
          box-shadow: 0 0 0 1px rgba(0,0,0,0.1) !important;
        }
        
        .${this.activeHighlightClass} {
          background-color: #ff9800 !important;
          color: #fff !important;
          box-shadow: 0 0 0 2px #ff5722 !important;
        }
        
        @keyframes highlight-pulse {
          0% { box-shadow: 0 0 0 2px #ff5722; }
          50% { box-shadow: 0 0 0 4px rgba(255, 87, 34, 0.5); }
          100% { box-shadow: 0 0 0 2px #ff5722; }
        }
        
        .${this.activeHighlightClass} {
          animation: highlight-pulse 1s ease-in-out;
        }
      `;
    document.head.appendChild(styleSheet);
  }

  public search(term: string): { total: number; current: number } {
    // Clear previous search
    this.clearHighlights();

    if (!term.trim()) {
      return { total: 0, current: 0 };
    }

    this.searchTerm = term.toLowerCase();
    this.currentMatches = [];
    this.currentIndex = -1;

    // Get all text nodes in the document
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: (node) => {
          // Skip script, style, and other non-visible elements
          const parent = node.parentElement;
          if (!parent) return NodeFilter.FILTER_REJECT;

          const tagName = parent.tagName.toLowerCase();
          if (
            ["script", "style", "noscript", "iframe", "object"].includes(
              tagName
            )
          ) {
            return NodeFilter.FILTER_REJECT;
          }

          // Skip if parent is hidden
          const style = window.getComputedStyle(parent);
          if (style.display === "none" || style.visibility === "hidden") {
            return NodeFilter.FILTER_REJECT;
          }

          // Only accept nodes with text content that matches our search
          return node.textContent &&
            node.textContent.toLowerCase().includes(this.searchTerm)
            ? NodeFilter.FILTER_ACCEPT
            : NodeFilter.FILTER_REJECT;
        },
      }
    );

    const textNodes: Text[] = [];
    let node;
    while ((node = walker.nextNode()) !== null) {
      textNodes.push(node as Text);
    }

    // Highlight matches in each text node
    textNodes.forEach((textNode) => {
      this.highlightInTextNode(textNode);
    });

    // If we have matches, highlight the first one
    if (this.currentMatches.length > 0) {
      this.currentIndex = 0;
      this.setActiveMatch(0);
    }

    return {
      total: this.currentMatches.length,
      current: this.currentMatches.length > 0 ? 1 : 0,
    };
  }

  private highlightInTextNode(textNode: Text): void {
    const text = textNode.textContent || "";
    const lowerText = text.toLowerCase();
    const searchTermLower = this.searchTerm.toLowerCase();

    if (!lowerText.includes(searchTermLower)) return;

    const parent = textNode.parentNode;
    if (!parent) return;

    const fragments: Node[] = [];
    let lastIndex = 0;
    let index = lowerText.indexOf(searchTermLower);

    while (index !== -1) {
      // Add text before match
      if (index > lastIndex) {
        fragments.push(document.createTextNode(text.slice(lastIndex, index)));
      }

      // Create highlighted span
      const span = document.createElement("span");
      span.className = this.highlightClass;
      span.textContent = text.slice(index, index + searchTermLower.length);
      fragments.push(span);
      this.currentMatches.push(span);

      lastIndex = index + searchTermLower.length;
      index = lowerText.indexOf(searchTermLower, lastIndex);
    }

    // Add remaining text
    if (lastIndex < text.length) {
      fragments.push(document.createTextNode(text.slice(lastIndex)));
    }

    // Replace the original text node with fragments
    fragments.forEach((fragment) => {
      parent.insertBefore(fragment, textNode);
    });
    parent.removeChild(textNode);
  }

  public navigateNext(): { total: number; current: number } {
    if (this.currentMatches.length === 0) {
      return { total: 0, current: 0 };
    }

    this.currentIndex = (this.currentIndex + 1) % this.currentMatches.length;
    this.setActiveMatch(this.currentIndex);

    return {
      total: this.currentMatches.length,
      current: this.currentIndex + 1,
    };
  }

  public navigatePrevious(): { total: number; current: number } {
    if (this.currentMatches.length === 0) {
      return { total: 0, current: 0 };
    }

    this.currentIndex =
      this.currentIndex <= 0
        ? this.currentMatches.length - 1
        : this.currentIndex - 1;
    this.setActiveMatch(this.currentIndex);

    return {
      total: this.currentMatches.length,
      current: this.currentIndex + 1,
    };
  }

  private setActiveMatch(index: number): void {
    // Remove active class from all matches
    this.currentMatches.forEach((match) => {
      match.classList.remove(this.activeHighlightClass);
    });

    // Add active class to current match
    if (this.currentMatches[index]) {
      const activeMatch = this.currentMatches[index];
      activeMatch.classList.add(this.activeHighlightClass);

      // Scroll to the active match
      activeMatch.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "nearest",
      });
    }
  }

  public clearHighlights(): void {
    // Find all highlighted elements
    const highlights = document.querySelectorAll(`.${this.highlightClass}`);

    highlights.forEach((highlight) => {
      const parent = highlight.parentNode;
      if (parent) {
        // Replace highlighted span with its text content
        const textNode = document.createTextNode(highlight.textContent || "");
        parent.replaceChild(textNode, highlight);

        // Normalize the parent to merge adjacent text nodes
        parent.normalize();
      }
    });

    this.currentMatches = [];
    this.currentIndex = -1;
    this.searchTerm = "";
  }

  public getCurrentStats(): { total: number; current: number } {
    return {
      total: this.currentMatches.length,
      current: this.currentMatches.length > 0 ? this.currentIndex + 1 : 0,
    };
  }
}
