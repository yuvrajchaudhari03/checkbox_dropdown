import React, { useEffect, useRef, useState } from 'react';
import { Box, Stack, TextField, InputAdornment, IconButton, Typography, Chip, Checkbox, List, ListItem, ListItemText, ListItemButton, Popover, CircularProgress } from '@mui/material';
import { Search as SearchIcon, ExpandMore, ChevronRight as ChevronRightIcon, Clear as ClearIcon } from '@mui/icons-material';
import { Category, Subcategory } from '../types/taxonomy';

interface SelectedItem {
  type: 'category' | 'subcategory' | 'nested';
  categoryId: string;
  categoryName: string;
  subcategoryId?: string;
  subcategoryName?: string;
  nestedId?: string;
  nestedName?: string;
}

interface SearchTaxonomiesProps {
  data: Category[];
  isLoading: boolean;
  error?: string | null;
  onRefresh?: () => void;
  selectedItem: SelectedItem | null;
  onSelectionChange: (selection: SelectedItem | null) => void;
}

const SearchTaxonomies: React.FC<SearchTaxonomiesProps> = ({ 
  data, 
  isLoading, 
  error, 
  onRefresh, 
  selectedItem, 
  onSelectionChange 
}) => {
  console.log('SearchTaxonomies props:', { data, isLoading, error, selectedItem });
  const [isExpanded, setIsExpanded] = useState(false);
  const [categories, setCategories] = useState<Category[]>(data || []);
  const [keyword, setKeyword] = useState('');
  
  useEffect(() => {
    console.log('Updated categories:', categories);
  }, [categories]);
  const [debouncedKeyword, setDebouncedKeyword] = useState('');
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const anchorBoxRef = useRef<HTMLDivElement | null>(null);
  const [openViaKeyboard, setOpenViaKeyboard] = useState(false);


  useEffect(() => {
    if (data) {
      setCategories(data);
    }
  }, [data]);

  // Debounce the search keyword to avoid excessive filtering
  useEffect(() => {
    const id = setTimeout(() => setDebouncedKeyword(keyword), 150);
    return () => clearTimeout(id);
  }, [keyword]);

  // Effect to handle auto-expansion based on search
  useEffect(() => {
    const searchTerm = debouncedKeyword.trim().toLowerCase();
    
    if (!searchTerm) {
      // Reset expansion state when search is cleared
      setCategories(prev =>
        prev.map(category => ({
          ...category,
          expanded: false,
          subcategories: category.subcategories.map(sub => ({
            ...sub,
            expanded: false
          }))
        }))
      );
      return;
    }

    // Function to check if text matches search term
    const matchesSearch = (text: string) => text.toLowerCase().includes(searchTerm);

    setCategories(prev =>
      prev.map(category => {
        const categoryMatches = matchesSearch(category.name);
        
        // Process subcategories and their record types
        const updatedSubcategories = category.subcategories.map(sub => {
          const subMatches = matchesSearch(sub.name);
          const recordTypeMatches = sub.subcategories.some(record => 
            matchesSearch(record.name)
          );
          
          return {
            ...sub,
            expanded: subMatches || recordTypeMatches,
            subcategories: sub.subcategories.map(record => ({
              ...record,
              selected: record.selected
            }))
          };
        });

        // Determine if category should be expanded based on matches
        const shouldExpandCategory = categoryMatches || 
          updatedSubcategories.some(sub => matchesSearch(sub.name) || 
            sub.subcategories.some(record => matchesSearch(record.name))
          );

        return {
          ...category,
          expanded: shouldExpandCategory,
          subcategories: updatedSubcategories
        };
      })
    );
  }, [debouncedKeyword]);

  // Effect to handle auto-expansion based on search
  useEffect(() => {
    const searchTerm = debouncedKeyword.trim().toLowerCase();
    
    if (!searchTerm) {
      // Reset expansion state when search is cleared
      setCategories(prev =>
        prev.map(category => ({
          ...category,
          expanded: false,
          subcategories: category.subcategories.map(sub => ({
            ...sub,
            expanded: false,
            subcategories: sub.subcategories.map(record => ({
              ...record,
              expanded: false,
              subcategories: [] // Leaf nodes have empty subcategories array
            }))
          }))
        }))
      );
      return;
    }

    // Function to check if text matches search term
    const matchesSearch = (text: string) => text.toLowerCase().includes(searchTerm);

    setCategories(prev =>
      prev.map(category => {
        const categoryMatches = matchesSearch(category.name);
        
        // Process subcategories and their record types
        const updatedSubcategories = category.subcategories.map(sub => {
          const subMatches = matchesSearch(sub.name);
          const recordTypeMatches = sub.subcategories.some(record => 
            matchesSearch(record.name)
          );
          
          return {
            ...sub,
            expanded: subMatches || recordTypeMatches,
            subcategories: sub.subcategories.map(record => ({
              ...record,
              expanded: false,
              subcategories: [] // Leaf nodes have empty subcategories array
            }))
          };
        });

        // Determine if category should be expanded based on matches
        const shouldExpandCategory = categoryMatches || 
          updatedSubcategories.some(sub => matchesSearch(sub.name) || 
            sub.subcategories.some(record => matchesSearch(record.name))
          );

        return {
          ...category,
          expanded: shouldExpandCategory,
          subcategories: updatedSubcategories
        };
      })
    );
  }, [debouncedKeyword]);

  // Effect to handle auto-expansion based on search
  useEffect(() => {
    const searchTerm = debouncedKeyword.trim().toLowerCase();
    
    if (!searchTerm) {
      // Reset expansion state when search is cleared
      setCategories(prev =>
        prev.map(category => ({
          ...category,
          expanded: false,
          subcategories: category.subcategories.map(sub => ({
            ...sub,
            expanded: false,
            subcategories: sub.subcategories || []
          }))
        }))
      );
      return;
    }

    // Function to check if text matches search term
    const matchesSearch = (text: string) => text.toLowerCase().includes(searchTerm);

    setCategories(prev =>
      prev.map(category => {
        const categoryMatches = matchesSearch(category.name);
        
        // Process subcategories and their record types
        const updatedSubcategories = category.subcategories.map(sub => {
          const subMatches = matchesSearch(sub.name);
          const recordTypeMatches = sub.subcategories.some(record => 
            matchesSearch(record.name)
          );
          
          return {
            ...sub,
            expanded: subMatches || recordTypeMatches,
            subcategories: sub.subcategories.map(record => ({
              ...record,
              selected: record.selected,
              expanded: false
            }))
          };
        });

        // Determine if category should be expanded based on matches
        const shouldExpandCategory = categoryMatches || 
          updatedSubcategories.some(sub => matchesSearch(sub.name) || 
            sub.subcategories.some(record => matchesSearch(record.name))
          );

        return {
          ...category,
          expanded: shouldExpandCategory,
          subcategories: updatedSubcategories
        };
      })
    );
  }, [debouncedKeyword]);

  // Effect to handle auto-expansion based on search
  useEffect(() => {
    const searchTerm = debouncedKeyword.trim().toLowerCase();
    
    if (!searchTerm) {
      // Reset expansion state when search is cleared
      setCategories(prev =>
        prev.map(category => ({
          ...category,
          expanded: false,
          subcategories: category.subcategories.map(sub => ({
            ...sub,
            expanded: false,
            selected: sub.selected,
            subcategories: (sub.subcategories || []).map(record => ({
              ...record,
              selected: record.selected,
              expanded: false
            }))
          }))
        }))
      );
      return;
    }

    // Function to check if text matches search term
    const matchesSearch = (text: string) => text.toLowerCase().includes(searchTerm);

    setCategories(prev =>
      prev.map(category => {
        const categoryMatches = matchesSearch(category.name);
        
        // Process subcategories and their record types
        const updatedSubcategories = category.subcategories.map(sub => {
          const subMatches = matchesSearch(sub.name);
          const recordTypeMatches = (sub.subcategories || []).some(record => 
            matchesSearch(record.name)
          );
          
          return {
            id: sub.id,
            name: sub.name,
            selected: sub.selected,
            expanded: subMatches || recordTypeMatches,
            subcategories: (sub.subcategories || []).map(record => ({
              id: record.id,
              name: record.name,
              selected: record.selected,
              expanded: false
            }))
          };
        });

        // Determine if category should be expanded based on matches
        const shouldExpandCategory = categoryMatches || 
          updatedSubcategories.some(sub => matchesSearch(sub.name) || 
            (sub.subcategories || []).some(record => matchesSearch(record.name))
          );

        return {
          id: category.id,
          name: category.name,
          selected: category.selected,
          expanded: shouldExpandCategory,
          subcategories: updatedSubcategories
        };
      })
    );
  }, [debouncedKeyword]);

  // Effect to handle auto-expansion based on search
  useEffect(() => {
    const searchTerm = debouncedKeyword.trim().toLowerCase();
    
    if (!searchTerm) {
      // Reset expansion state when search is cleared
      setCategories(prev =>
        prev.map(category => ({
          ...category,
          expanded: false,
          subcategories: category.subcategories.map(sub => ({
            ...sub,
            expanded: false,
            subcategories: sub.subcategories || []
          }))
        }))
      );
      return;
    }

    const shouldExpand = (text: string) => text.toLowerCase().includes(searchTerm);

    setCategories(prev =>
      prev.map(category => {
        const categoryMatches = shouldExpand(category.name);
        
        const updatedSubcategories = category.subcategories.map(sub => {
          const subMatches = shouldExpand(sub.name);
          const recordTypeMatches = (sub.subcategories || []).some(record => 
            shouldExpand(record.name)
          );
          
          // Keep existing subcategories (record types) but ensure all properties are set
          return {
            ...sub,
            expanded: subMatches || recordTypeMatches,
            subcategories: (sub.subcategories || []).map(record => ({
              ...record,
              selected: record.selected,
              expanded: false // Record types don't need to be expandable
            }))
          };
        });

        const shouldExpandCategory = categoryMatches || updatedSubcategories.some(sub => 
          sub.expanded || shouldExpand(sub.name)
        );

        return {
          ...category,
          expanded: shouldExpandCategory,
          subcategories: updatedSubcategories
        };
      })
    );
  }, [debouncedKeyword]);

  // Effect to handle auto-expansion based on search
  useEffect(() => {
    if (!debouncedKeyword.trim()) {
      // Reset expansion state when search is cleared
      setCategories(prev =>
        prev.map(category => ({
          ...category,
          expanded: false,
          subcategories: category.subcategories.map(sub => ({
            ...sub,
            expanded: false
          }))
        }))
      );
      return;
    }

    setCategories(prev =>
      prev.map(category => {
        const searchTerm = debouncedKeyword.toLowerCase();
        const categoryMatches = category.name.toLowerCase().includes(searchTerm);
        
        const updatedSubcategories = category.subcategories.map(sub => {
          const subMatches = sub.name.toLowerCase().includes(searchTerm);
          const recordTypeMatches = sub.subcategories?.some(record => 
            record.name.toLowerCase().includes(searchTerm)
          );
          
          return {
            ...sub,
            expanded: subMatches || recordTypeMatches || false, // Ensure boolean type
            subcategories: sub.subcategories || [] // Ensure subcategories is always an array
          };
        });

        return {
          ...category,
          expanded: categoryMatches || updatedSubcategories.some(sub => sub.expanded),
          subcategories: updatedSubcategories
        };
      })
    );
  }, [debouncedKeyword]);

  // Effect to handle auto-expansion based on search
  useEffect(() => {
    if (!debouncedKeyword.trim()) {
      // If no search keyword, don't auto-expand
      return;
    }

    setCategories(prev =>
      prev.map(category => {
        const searchTerm = debouncedKeyword.toLowerCase();
        const categoryMatches = category.name.toLowerCase().includes(searchTerm);
        
        const updatedSubcategories = category.subcategories.map(sub => {
          const subMatches = sub.name.toLowerCase().includes(searchTerm);
          const recordTypeMatches = sub.subcategories?.some(record => 
            record.name.toLowerCase().includes(searchTerm)
          );
          
          return {
            ...sub,
            expanded: subMatches || recordTypeMatches, // Auto-expand if subcategory or its record types match
          };
        });

        return {
          ...category,
          expanded: categoryMatches || updatedSubcategories.some(sub => sub.expanded), // Auto-expand if category matches or any subcategory matches
          subcategories: updatedSubcategories,
        };
      })
    );
  }, [debouncedKeyword]);

  // Filter categories based on search keyword
  const filterCategories = (categories: Category[], searchTerm: string): Category[] => {
    if (!searchTerm.trim()) return categories;

    const filtered = categories.map(category => {
      const categoryMatches = category.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      const filteredSubcategories = category.subcategories.map(subcategory => {
        const subcategoryMatches = subcategory.name.toLowerCase().includes(searchTerm.toLowerCase());
        
        const filteredNested = subcategory.subcategories?.filter(nested =>
          nested.name.toLowerCase().includes(searchTerm.toLowerCase())
        ) || [];

        // Include subcategory if it matches or has matching nested items
        if (subcategoryMatches || filteredNested.length > 0) {
          return {
            ...subcategory,
            subcategories: filteredNested.length > 0 ? filteredNested : subcategory.subcategories
          };
        }
        return null;
      }).filter(Boolean) as Subcategory[];

      // Include category if it matches or has matching subcategories
      if (categoryMatches || filteredSubcategories.length > 0) {
        return {
          ...category,
          subcategories: filteredSubcategories,
          expanded: searchTerm.trim() ? true : category.expanded // Auto-expand when searching
        };
      }
      return null;
    }).filter(Boolean) as Category[];

    return filtered;
  };

  // Highlight matching text
  const highlightText = (text: string, searchTerm: string) => {
    if (!searchTerm.trim()) return text;
    
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <span key={index} className="bg-yellow-200 font-semibold">{part}</span>
      ) : (
        part
      )
    );
  };

  const filteredCategories = filterCategories(categories, debouncedKeyword);

  // Get selected item name
  const getSelectedName = () => {
    if (!selectedItem) return undefined;
    
    if (selectedItem.type === 'category') {
      return selectedItem.categoryName;
    }
    
    if (selectedItem.type === 'subcategory') {
      return selectedItem.subcategoryName;
    }

    return selectedItem.nestedName;
  };

  const handleCategoryToggle = (categoryId: string) => {
    setCategories(prev =>
      prev.map(cat =>
        cat.id === categoryId
          ? { ...cat, expanded: !cat.expanded }
          : cat
      )
    );
  };

  const handleCategorySelect = (categoryId: string) => {
    // If this category is already selected, deselect it
    if (selectedItem?.type === 'category' && selectedItem.categoryId === categoryId) {
      onSelectionChange(null);
      setCategories(prev =>
        prev.map(cat => ({
          ...cat,
          selected: false,
          subcategories: cat.subcategories.map(sub => ({
            ...sub,
            selected: false,
            subcategories: sub.subcategories?.map(subsub => ({
              ...subsub,
              selected: false
            }))
          }))
        }))
      );
      return;
    }

    // Set new selection
    const selectedCategory = categories.find(cat => cat.id === categoryId);
    if (!selectedCategory) return;

    onSelectionChange({
      type: 'category',
      categoryId,
      categoryName: selectedCategory.name
    });
    setCategories(prev =>
      prev.map(cat =>
        cat.id === categoryId
          ? {
              ...cat,
              selected: true,
              subcategories: cat.subcategories.map(sub => ({
                ...sub,
                selected: false,
                subcategories: sub.subcategories?.map(subsub => ({
                  ...subsub,
                  selected: false
                }))
              }))
            }
          : {
              ...cat,
              selected: false,
              subcategories: cat.subcategories.map(sub => ({
                ...sub,
                selected: false,
                subcategories: sub.subcategories?.map(subsub => ({
                  ...subsub,
                  selected: false
                }))
              }))
            }
      )
    );
  };

  const handleSubcategoryExpand = (categoryId: string, subcategoryId: string) => {
    setCategories(prev =>
      prev.map(cat =>
        cat.id === categoryId
          ? {
              ...cat,
              subcategories: cat.subcategories.map(sub =>
                sub.id === subcategoryId
                  ? { ...sub, expanded: !sub.expanded }
                  : sub
              )
            }
          : cat
      )
    );
  };

  const handleSubcategorySelect = (categoryId: string, subcategoryId: string) => {
    // If this subcategory is already selected, deselect it
    if (selectedItem?.type === 'subcategory' && selectedItem.categoryId === categoryId && selectedItem.subcategoryId === subcategoryId) {
      onSelectionChange(null);
      setCategories(prev =>
        prev.map(cat => ({
          ...cat,
          selected: false,
          subcategories: cat.subcategories.map(sub => ({
            ...sub,
            selected: false,
            subcategories: sub.subcategories?.map(subsub => ({
              ...subsub,
              selected: false
            }))
          }))
        }))
      );
      return;
    }

    // Set new selection
    const selectedCategory = categories.find(cat => cat.id === categoryId);
    if (!selectedCategory) return;
    
    const selectedSubcategory = selectedCategory.subcategories.find(sub => sub.id === subcategoryId);
    if (!selectedSubcategory) return;

    onSelectionChange({
      type: 'subcategory',
      categoryId,
      categoryName: selectedCategory.name,
      subcategoryId,
      subcategoryName: selectedSubcategory.name
    });
    setCategories(prev =>
      prev.map(cat =>
        cat.id === categoryId
          ? {
              ...cat,
              selected: false,
              subcategories: cat.subcategories.map(sub =>
                sub.id === subcategoryId
                  ? {
                      ...sub,
                      selected: true,
                      subcategories: sub.subcategories?.map(subsub => ({
                        ...subsub,
                        selected: false
                      }))
                    }
                  : {
                      ...sub,
                      selected: false,
                      subcategories: sub.subcategories?.map(subsub => ({
                        ...subsub,
                        selected: false
                      }))
                    }
              )
            }
          : {
              ...cat,
              selected: false,
              subcategories: cat.subcategories.map(sub => ({
                ...sub,
                selected: false,
                subcategories: sub.subcategories?.map(subsub => ({
                  ...subsub,
                  selected: false
                }))
              }))
            }
      )
    );
  };

  const handleNestedSubcategorySelect = (categoryId: string, subcategoryId: string, nestedId: string) => {
    // If this nested item is already selected, deselect it
    if (selectedItem?.type === 'nested' && selectedItem.categoryId === categoryId && selectedItem.subcategoryId === subcategoryId && selectedItem.nestedId === nestedId) {
      onSelectionChange(null);
      setCategories(prev =>
        prev.map(cat => ({
          ...cat,
          selected: false,
          subcategories: cat.subcategories.map(sub => ({
            ...sub,
            selected: false,
            subcategories: sub.subcategories?.map(subsub => ({
              ...subsub,
              selected: false
            }))
          }))
        }))
      );
      return;
    }

    // Set new selection
    const selectedCategory = categories.find(cat => cat.id === categoryId);
    if (!selectedCategory) return;
    
    const selectedSubcategory = selectedCategory.subcategories.find(sub => sub.id === subcategoryId);
    if (!selectedSubcategory) return;

    const selectedNested = selectedSubcategory.subcategories?.find(n => n.id === nestedId);
    if (!selectedNested) return;

    onSelectionChange({
      type: 'nested',
      categoryId,
      categoryName: selectedCategory.name,
      subcategoryId,
      subcategoryName: selectedSubcategory.name,
      nestedId,
      nestedName: selectedNested.name
    });
    setCategories(prev =>
      prev.map(cat =>
        cat.id === categoryId
          ? {
              ...cat,
              selected: false,
              subcategories: cat.subcategories.map(sub =>
                sub.id === subcategoryId
                  ? {
                      ...sub,
                      selected: false,
                      subcategories: sub.subcategories?.map(nested =>
                        nested.id === nestedId
                          ? { ...nested, selected: true }
                          : { ...nested, selected: false }
                      )
                    }
                  : {
                      ...sub,
                      selected: false,
                      subcategories: sub.subcategories?.map(subsub => ({
                        ...subsub,
                        selected: false
                      }))
                    }
              )
            }
          : {
              ...cat,
              selected: false,
              subcategories: cat.subcategories.map(sub => ({
                ...sub,
                selected: false,
                subcategories: sub.subcategories?.map(subsub => ({
                  ...subsub,
                  selected: false
                }))
              }))
            }
      )
    );
  };

  const handleClearSelection = () => {
    onSelectionChange(null);
    setCategories(prev =>
      prev.map(cat => ({
        ...cat,
        selected: false,
        subcategories: cat.subcategories.map(sub => ({
          ...sub,
          selected: false,
          subcategories: sub.subcategories?.map(nested => ({
            ...nested,
            selected: false
          }))
        }))
      }))
    );
  };

  const renderSubcategory = (subcategory: Subcategory, categoryId: string) => (
    <>
      <ListItem
        key={subcategory.id}
        id={`line-cat-${categoryId}__sub-${subcategory.id}`}
        data-id={`${categoryId}_${subcategory.id}`}
        divider
        sx={{ pl: 6 }}
        role="treeitem"
        aria-level={2}
        aria-selected={subcategory.selected || false}
        aria-expanded={(subcategory.subcategories && subcategory.subcategories.length > 0) || false}
        aria-label={`Subcategory ${subcategory.name}`}
        secondaryAction={
          subcategory.subcategories && subcategory.subcategories.length > 0 ? (
            <IconButton onClick={(e) => {
              e.stopPropagation();
              handleSubcategoryExpand(categoryId, subcategory.id);
            }} size="small" edge="end">
              {subcategory.expanded ? (
                <ExpandMore fontSize="small" />
              ) : (
                <ChevronRightIcon fontSize="small" />
              )}
            </IconButton>
          ) : undefined
        }
      >
        <ListItemButton
          onClick={() => {
            if (!selectedItem || (selectedItem.type === 'subcategory' && selectedItem.categoryId === categoryId && selectedItem.subcategoryId === subcategory.id)) {
              handleSubcategorySelect(categoryId, subcategory.id);
            }
          }}
          dense
          disabled={!!(selectedItem && !(selectedItem.type === 'subcategory' && selectedItem.categoryId === categoryId && selectedItem.subcategoryId === subcategory.id))}
          sx={{ pl: 0 }}
        >
          <Checkbox
            checked={!!subcategory.selected}
            tabIndex={-1}
            disableRipple
            size="small"
            edge="start"
            inputProps={{ 'aria-label': `Select subcategory ${subcategory.name}` }}
          />
          <ListItemText
            primary={highlightText(subcategory.name, debouncedKeyword)}
            primaryTypographyProps={{ fontSize: 14, fontWeight: 500, color: subcategory.selected ? 'text.primary' : (selectedItem ? 'text.disabled' : 'text.primary') }}
          />
        </ListItemButton>
      </ListItem>

      {subcategory.expanded && subcategory.subcategories && subcategory.subcategories.length > 0 && (
        <List disablePadding role="group" aria-label={`Nested of ${subcategory.name}`}>
          {subcategory.subcategories.map(nested => (
            <ListItem
              key={nested.id}
              id={`line-cat-${categoryId}__sub-${subcategory.id}__nested-${nested.id}`}
              data-id={`${categoryId}_${subcategory.id}_${nested.id}`}
              sx={{ pl: 9 }}
              role="treeitem"
              aria-level={3}
              aria-selected={nested.selected || false}
              aria-label={`Nested ${nested.name}`}
            >
              <ListItemButton
                onClick={() => {
                  if (!selectedItem || (selectedItem.type === 'nested' && selectedItem.categoryId === categoryId && selectedItem.subcategoryId === subcategory.id && selectedItem.nestedId === nested.id)) {
                    handleNestedSubcategorySelect(categoryId, subcategory.id, nested.id);
                  }
                }}
                dense
                disabled={!!(selectedItem && !(selectedItem.type === 'nested' && selectedItem.categoryId === categoryId && selectedItem.subcategoryId === subcategory.id && selectedItem.nestedId === nested.id))}
                sx={{ pl: 0 }}
              >
                <Checkbox
                  checked={!!nested.selected}
                  tabIndex={-1}
                  disableRipple
                  size="small"
                  edge="start"
                  inputProps={{ 'aria-label': `Select nested ${nested.name}` }}
                />
                <ListItemText
                  primary={highlightText(nested.name, debouncedKeyword)}
                  primaryTypographyProps={{ fontSize: 13, color: nested.selected ? 'text.primary' : (selectedItem ? 'text.disabled' : 'text.primary') }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      )}
    </>
  );

  return (
    <Box sx={{ maxWidth: 960, mx: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* Search Header */}
      <Stack direction="row" spacing={2}>
        <Box sx={{ flex: 1, position: 'relative' }} ref={anchorBoxRef}>
          <TextField
            fullWidth
            placeholder="Select a taxonomy"
            value={selectedItem ? getSelectedName() : ''}
            onFocus={() => { setIsExpanded(true); setAnchorEl(anchorBoxRef.current); }}
            onClick={() => { setIsExpanded(true); setAnchorEl(anchorBoxRef.current); }}
            InputProps={{
              readOnly: true,
              startAdornment: selectedItem ? (
                <InputAdornment position="start">
                  <Chip 
                    label={getSelectedName()}
                    size="small" 
                    color="primary" 
                    onDelete={handleClearSelection}
                    sx={{ mr: 1 }}
                  />
                </InputAdornment>
              ) : null,
              endAdornment: (
                <InputAdornment position="end">
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    {selectedItem && (
                      <IconButton
                        aria-label="Clear selection"
                        onClick={handleClearSelection}
                        edge="end"
                        size="small"
                      >
                        <ClearIcon fontSize="small" />
                      </IconButton>
                    )}
                    <IconButton
                      aria-label={isExpanded ? 'Collapse' : 'Expand'}
                      onClick={() => { const next = !isExpanded; setIsExpanded(next); if (next) setAnchorEl(anchorBoxRef.current); }}
                      edge="end"
                      size="small"
                    >
                      <ExpandMore sx={{ transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                    </IconButton>
                  </Stack>
                </InputAdornment>
              ),
            }}
            size="medium"
            inputRef={inputRef}
          />
        </Box>
      </Stack>

      {/* Taxonomies Popover */}
      <Popover
        open={isExpanded}
        anchorEl={anchorEl}
        onClose={(_event, reason) => {
          setIsExpanded(false);
          setOpenViaKeyboard(false);
          if (reason === 'escapeKeyDown') {
            // Only restore focus on Escape, not on outside click
            inputRef.current?.focus();
          }
        }}
        marginThreshold={0}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        slotProps={{ paper: { sx: { mt: 1, width: anchorEl ? (anchorEl as HTMLElement).offsetWidth : undefined, borderRadius: 2 } } }}
        disableAutoFocus
        disableEnforceFocus
        disableRestoreFocus
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            setIsExpanded(false);
            // Return focus to the input
            setTimeout(() => inputRef.current?.focus(), 0);
          }
        }}
      >
        <Box sx={{ bgcolor: 'background.paper', borderRadius: 2, overflow: 'hidden' }}>
          {/* Search Box */}
          <Box sx={{ bgcolor: 'grey.50', px: 3, py: 1.5, borderBottom: 1, borderColor: 'grey.200' }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search categories..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
                endAdornment: keyword ? (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="Clear search"
                      onClick={() => setKeyword('')}
                      edge="end"
                      size="small"
                    >
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ) : null
              }}
            />
          </Box>

          {/* Categories List */}
          <Box sx={{ maxHeight: 384, overflowY: 'auto' }}>
            {isLoading ? (
              <Box sx={{ px: 3, py: 4, textAlign: 'center' }}>
                <CircularProgress size={40} />
                <Typography variant="subtitle1" sx={{ mt: 2 }}>Loading categories...</Typography>
              </Box>
            ) : error ? (
              <Box sx={{ px: 3, py: 4, textAlign: 'center', color: 'error.main' }}>
                <Typography variant="subtitle1">{error}</Typography>
                {onRefresh && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    <IconButton color="primary" onClick={onRefresh} size="small">
                      Try again
                    </IconButton>
                  </Typography>
                )}
              </Box>
            ) : !data || (filteredCategories.length === 0 && !debouncedKeyword.trim()) ? (
              <Box sx={{ px: 3, py: 4, textAlign: 'center', color: 'text.secondary' }}>
                <Typography variant="subtitle1" fontWeight={600}>No categories available</Typography>
              </Box>
            ) : filteredCategories.length === 0 && debouncedKeyword.trim() ? (
              <Box sx={{ px: 3, py: 4, textAlign: 'center', color: 'text.secondary' }}>
                <SearchIcon sx={{ fontSize: 36, color: 'grey.400', mb: 1 }} />
                <Typography variant="subtitle1" fontWeight={600}>No results found</Typography>
                <Typography variant="caption">Try adjusting your search terms</Typography>
              </Box>
            ) : (
              <List disablePadding role="tree" aria-label="Taxonomy categories">
                {filteredCategories.map((category, idx) => (
                  <React.Fragment key={category.id}>
                    <ListItem
                      id={`line-cat-${category.id}`}
                      data-id={category.id}
                      divider
                      sx={{ bgcolor: category.selected ? 'action.hover' : 'transparent' }}
                      role="treeitem"
                      aria-level={1}
                      aria-selected={category.selected || false}
                      aria-expanded={category.expanded || false}
                      aria-label={`Category ${category.name}`}
                      secondaryAction={
                        <IconButton onClick={() => handleCategoryToggle(category.id)} size="small" edge="end">
                          {category.expanded ? (
                            <ExpandMore fontSize="small" />
                          ) : (
                            <ChevronRightIcon fontSize="small" />
                          )}
                        </IconButton>
                      }
                    >
                      <ListItemButton
                        onClick={() => {
                          if (!selectedItem || (selectedItem.type === 'category' && selectedItem.categoryId === category.id)) {
                            handleCategorySelect(category.id);
                          }
                        }}
                        dense
                        disabled={!!(selectedItem && !(selectedItem.type === 'category' && selectedItem.categoryId === category.id))}
                        sx={{ pl: 0 }}
                        autoFocus={openViaKeyboard && isExpanded && idx === 0}
                      >
                        <Checkbox
                          checked={!!category.selected}
                          tabIndex={-1}
                          disableRipple
                          size="small"
                          edge="start"
                          inputProps={{ 'aria-label': `Select category ${category.name}` }}
                        />
                        <ListItemText
                          primary={highlightText(category.name, debouncedKeyword)}
                          primaryTypographyProps={{ fontWeight: 600, color: category.selected ? 'text.primary' : (selectedItem ? 'text.disabled' : 'text.primary') }}
                        />
                      </ListItemButton>
                    </ListItem>

                    {/* Subcategories */}
                    {category.expanded && (
                      <List disablePadding role="group" aria-label={`Subcategories of ${category.name}`}>
                        {category.subcategories.map((subcategory) => 
                          renderSubcategory(subcategory, category.id)
                        )}
                      </List>
                    )}
                  </React.Fragment>
                ))}
              </List>
            )}
          </Box>
        </Box>
      </Popover>
    </Box>
  );
};

export default SearchTaxonomies;