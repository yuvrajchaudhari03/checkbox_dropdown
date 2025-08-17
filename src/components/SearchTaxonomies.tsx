import React, { useEffect, useRef, useState } from 'react';
import { Box, Stack, TextField, InputAdornment, IconButton, Typography, Chip, Checkbox, List, ListItem, ListItemText, ListItemButton, Popover } from '@mui/material';
import { Search as SearchIcon, ExpandMore, ChevronRight as ChevronRightIcon, Clear as ClearIcon } from '@mui/icons-material';
import { Category, Subcategory } from '../types/taxonomy';
import { taxonomyData } from '../data/taxonomyData';

const SearchTaxonomies: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [categories, setCategories] = useState<Category[]>(taxonomyData.categories);
  const [keyword, setKeyword] = useState('');
  const [debouncedKeyword, setDebouncedKeyword] = useState('');
  const [selectedItem, setSelectedItem] = useState<{type: 'category' | 'subcategory' | 'nested', categoryId: string, subcategoryId?: string, nestedId?: string} | null>(null);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const anchorBoxRef = useRef<HTMLDivElement | null>(null);
  const [openViaKeyboard, setOpenViaKeyboard] = useState(false);

  // Build a stable numeric id map for every line (category, subcategory, nested)
  const [lineIdMap, setLineIdMap] = useState<Record<string, number>>({});

  useEffect(() => {
    let counter = 1;
    const map: Record<string, number> = {};

    const build = (cats: Category[]) => {
      cats.forEach((cat) => {
        const catKey = `cat:${cat.id}`;
        if (!(catKey in map)) map[catKey] = counter++;
        cat.subcategories.forEach((sub) => {
          const subKey = `cat:${cat.id}/sub:${sub.id}`;
          if (!(subKey in map)) map[subKey] = counter++;
          sub.subcategories?.forEach((nested) => {
            const nestedKey = `cat:${cat.id}/sub:${sub.id}/nested:${nested.id}`;
            if (!(nestedKey in map)) map[nestedKey] = counter++;
          });
        });
      });
    };

    build(taxonomyData.categories);
    setLineIdMap(map);
  }, []);

  // Debounce the search keyword to avoid excessive filtering
  useEffect(() => {
    const id = setTimeout(() => setDebouncedKeyword(keyword), 150);
    return () => clearTimeout(id);
  }, [keyword]);

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

  // Selected numeric id lookup
  const selectedNumericId = (() => {
    if (!selectedItem) return undefined;
    if (selectedItem.type === 'category') {
      return lineIdMap[`cat:${selectedItem.categoryId}`];
    }
    if (selectedItem.type === 'subcategory') {
      return lineIdMap[`cat:${selectedItem.categoryId}/sub:${selectedItem.subcategoryId}`];
    }
    return lineIdMap[`cat:${selectedItem.categoryId}/sub:${selectedItem.subcategoryId}/nested:${selectedItem.nestedId}`];
  })();

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
      setSelectedItem(null);
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
    setSelectedItem({type: 'category', categoryId});
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

  const handleSubcategorySelect = (categoryId: string, subcategoryId: string) => {
    // If this subcategory is already selected, deselect it
    if (selectedItem?.type === 'subcategory' && selectedItem.categoryId === categoryId && selectedItem.subcategoryId === subcategoryId) {
      setSelectedItem(null);
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
    setSelectedItem({type: 'subcategory', categoryId, subcategoryId});
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
      setSelectedItem(null);
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
    setSelectedItem({type: 'nested', categoryId, subcategoryId, nestedId});
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
    setSelectedItem(null);
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
        data-line-id={lineIdMap[`cat:${categoryId}/sub:${subcategory.id}`]}
        divider
        sx={{ pl: 6 }}
        role="treeitem"
        aria-level={2}
        aria-selected={subcategory.selected || false}
        aria-expanded={(subcategory.subcategories && subcategory.subcategories.length > 0) || false}
        aria-label={`Subcategory ${subcategory.name}`}
        secondaryAction={
          subcategory.subcategories && subcategory.subcategories.length > 0 ? (
            <ChevronRightIcon fontSize="small" sx={{ color: 'text.disabled' }} />
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

      {subcategory.subcategories && subcategory.subcategories.length > 0 && (
        <List disablePadding role="group" aria-label={`Nested of ${subcategory.name}`}>
          {subcategory.subcategories.map(nested => (
            <ListItem
              key={nested.id}
              id={`line-cat-${categoryId}__sub-${subcategory.id}__nested-${nested.id}`}
              data-line-id={lineIdMap[`cat:${categoryId}/sub:${subcategory.id}/nested:${nested.id}`]}
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
            placeholder="Search Taxonomies"
            value={keyword}
            onFocus={() => { setIsExpanded(true); setAnchorEl(anchorBoxRef.current); setOpenViaKeyboard(false); }}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') {
                if (!isExpanded) {
                  setIsExpanded(true);
                  setAnchorEl(anchorBoxRef.current);
                }
                setOpenViaKeyboard(true);
                // Allow focus to move into the list naturally
              } else if (e.key === 'Escape') {
                setIsExpanded(false);
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    {keyword && (
                      <IconButton
                        aria-label="Clear search"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => setKeyword('')}
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
          {/* Categories Header */}
          <Box sx={{ bgcolor: 'grey.50', px: 3, py: 2, borderBottom: 1, borderColor: 'grey.200' }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <Typography variant="h6" component="h2">Categories</Typography>
                {selectedItem && selectedNumericId !== undefined && (
                  <Chip label={`Selected: ${selectedNumericId}`} size="small" color="default" variant="outlined" />
                )}
              </Stack>
              {selectedItem && (
                <IconButton color="error" onClick={handleClearSelection} size="small">
                  <Typography variant="body2" color="error">Clear</Typography>
                </IconButton>
              )}
            </Stack>
          </Box>

          {/* Categories List */}
          <Box sx={{ maxHeight: 384, overflowY: 'auto' }}>
            {filteredCategories.length === 0 && debouncedKeyword.trim() ? (
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
                      data-line-id={lineIdMap[`cat:${category.id}`]}
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